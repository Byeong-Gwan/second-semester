"use client";

import React from "react";
import { StudyLogEntry } from "@/lib/store/studyLog";

interface CircularTimelineProps {
  logs: StudyLogEntry[];
  onLogClick: (log: StudyLogEntry) => void;
  onTimeBlockCreate: (startTime: string, endTime: string) => void;
  onLogUpdate: (logId: string, startTime: string, endTime: string) => void;
}

const COLORS = [
  "#60A5FA", // blue
  "#F472B6", // pink
  "#FBBF24", // yellow
  "#34D399", // green
  "#A78BFA", // purple
  "#FB923C", // orange
  "#38BDF8", // sky
  "#F87171", // red
  "#4ADE80", // lime
  "#C084FC", // violet
];

// 시간을 각도로 변환 (12시 방향이 0도)
function timeToAngle(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  // 0시(자정)가 맨 위(-90도), 시계방향으로 회전
  return (totalMinutes / (24 * 60)) * 360 - 90;
}

// 각도를 시간으로 변환 (15분 단위로 스냅)
function angleToTime(angle: number, snapMinutes: number = 15): string {
  // -90도를 0시로 맞추기
  const normalizedAngle = (angle + 90 + 360) % 360;
  let totalMinutes = Math.round((normalizedAngle / 360) * 24 * 60);
  
  // 스냅 처리
  totalMinutes = Math.round(totalMinutes / snapMinutes) * snapMinutes;
  
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// 두 각도 사이의 차이 계산 (시계방향)
function getAngleDifference(start: number, end: number): number {
  let diff = end - start;
  if (diff < 0) diff += 360;
  return diff;
}

export function CircularTimeline({ logs, onLogClick, onTimeBlockCreate, onLogUpdate }: CircularTimelineProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [hoveredLog, setHoveredLog] = React.useState<string | null>(null);
  const [draggingState, setDraggingState] = React.useState<{
    logId: string;
    type: "start" | "end" | "move";
    startAngle: number;
    endAngle: number;
    initialMouseAngle?: number;
  } | null>(null);

  const centerX = 350;
  const centerY = 350;
  const radius = 280;
  const innerRadius = 120;

  // 과목별 색상 매핑
  const subjectColors = React.useMemo(() => {
    const subjects = Array.from(new Set(logs.map((log) => log.subject)));
    const colorMap: Record<string, string> = {};
    subjects.forEach((subject, index) => {
      colorMap[subject] = COLORS[index % COLORS.length];
    });
    return colorMap;
  }, [logs]);

  // SVG 경로 생성 (파이 조각)
  const createArcPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + outerR * Math.cos(startRad);
    const y1 = centerY + outerR * Math.sin(startRad);
    const x2 = centerX + outerR * Math.cos(endRad);
    const y2 = centerY + outerR * Math.sin(endRad);
    const x3 = centerX + innerR * Math.cos(endRad);
    const y3 = centerY + innerR * Math.sin(endRad);
    const x4 = centerX + innerR * Math.cos(startRad);
    const y4 = centerY + innerR * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  };

  // 마우스 위치에서 각도 계산
  const getAngleFromMouse = (e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    return (Math.atan2(y, x) * 180) / Math.PI;
  };

  const handleEdgeMouseDown = (e: React.MouseEvent, log: StudyLogEntry, type: "start" | "end") => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log("핸들 드래그 시작:", log.subject, type);
    
    setDraggingState({
      logId: log.id,
      type,
      startAngle: timeToAngle(log.startTime),
      endAngle: timeToAngle(log.endTime),
    });
  };

  const handleBlockMouseDown = (e: React.MouseEvent, log: StudyLogEntry) => {
    e.stopPropagation();
    e.preventDefault();
    
    const mouseAngle = getAngleFromMouse(e);
    
    console.log("블록 전체 이동 시작:", log.subject);
    
    setDraggingState({
      logId: log.id,
      type: "move",
      startAngle: timeToAngle(log.startTime),
      endAngle: timeToAngle(log.endTime),
      initialMouseAngle: mouseAngle,
    });
  };

  // 전역 마우스 이벤트 리스너
  React.useEffect(() => {
    if (!draggingState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;
      const angle = (Math.atan2(y, x) * 180) / Math.PI;
      
      setDraggingState((prev) => {
        if (!prev) return null;
        
        if (prev.type === "start") {
          return { ...prev, startAngle: angle };
        } else if (prev.type === "end") {
          return { ...prev, endAngle: angle };
        } else if (prev.type === "move" && prev.initialMouseAngle !== undefined) {
          // 블록 전체 이동
          const angleDiff = angle - prev.initialMouseAngle;
          return {
            ...prev,
            startAngle: prev.startAngle + angleDiff,
            endAngle: prev.endAngle + angleDiff,
            initialMouseAngle: angle,
          };
        }
        return prev;
      });
    };

    const handleMouseUp = () => {
      if (!draggingState) return;
      
      console.log("드래그 종료");
      
      const newStartTime = angleToTime(draggingState.startAngle);
      const newEndTime = angleToTime(draggingState.endAngle);
      
      console.log("새 시간:", newStartTime, "→", newEndTime);
      
      // 시간 검증
      const startMinutes = parseInt(newStartTime.split(":")[0]) * 60 + parseInt(newStartTime.split(":")[1]);
      const endMinutes = parseInt(newEndTime.split(":")[0]) * 60 + parseInt(newEndTime.split(":")[1]);
      
      if (endMinutes > startMinutes) {
        onLogUpdate(draggingState.logId, newStartTime, newEndTime);
      } else {
        console.log("시간 검증 실패");
      }
      
      setDraggingState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingState, onLogUpdate]);

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 700 700"
        className="select-none w-full max-w-[700px] h-auto"
        style={{ cursor: draggingState ? "grabbing" : "default" }}
      >
        {/* 배경 원 */}
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="2" />
        <circle cx={centerX} cy={centerY} r={innerRadius} fill="none" stroke="#e5e7eb" strokeWidth="2" />

        {/* 시간 표시 (3시간 간격) */}
        {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
          const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
          const x = centerX + (radius + 30) * Math.cos(angle);
          const y = centerY + (radius + 30) * Math.sin(angle);
          return (
            <text
              key={hour}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-semibold fill-foreground"
            >
              {hour}
            </text>
          );
        })}

        {/* 15분 단위 눈금 */}
        {Array.from({ length: 96 }, (_, i) => {
          const angle = ((i / 96) * 360 - 90) * (Math.PI / 180);
          const isHour = i % 4 === 0;
          const lineLength = isHour ? 15 : 8;
          const x1 = centerX + (radius - lineLength) * Math.cos(angle);
          const y1 = centerY + (radius - lineLength) * Math.sin(angle);
          const x2 = centerX + radius * Math.cos(angle);
          const y2 = centerY + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#d1d5db"
              strokeWidth={isHour ? "2" : "1"}
            />
          );
        })}

        {/* 학습 블록 */}
        {logs.map((log) => {
          const isDraggingThis = draggingState?.logId === log.id;
          const startAngle = isDraggingThis ? draggingState.startAngle : timeToAngle(log.startTime);
          const endAngle = isDraggingThis ? draggingState.endAngle : timeToAngle(log.endTime);
          const color = subjectColors[log.subject];
          const isHovered = hoveredLog === log.id;

          const path = createArcPath(
            startAngle,
            endAngle,
            radius - 15,
            innerRadius + 15
          );

          // 텍스트 위치 (중간 각도)
          const midAngle = startAngle + getAngleDifference(startAngle, endAngle) / 2;
          const textRadius = (radius + innerRadius) / 2;
          const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180);
          const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180);

          // 드래그 핸들 위치
          const startHandleX = centerX + (radius - 15) * Math.cos((startAngle * Math.PI) / 180);
          const startHandleY = centerY + (radius - 15) * Math.sin((startAngle * Math.PI) / 180);
          const endHandleX = centerX + (radius - 15) * Math.cos((endAngle * Math.PI) / 180);
          const endHandleY = centerY + (radius - 15) * Math.sin((endAngle * Math.PI) / 180);

          return (
            <g key={log.id}>
              <path
                d={path}
                fill={color}
                opacity={isHovered || isDraggingThis ? 0.9 : 0.75}
                stroke="white"
                strokeWidth="3"
                className="cursor-move transition-opacity"
                onMouseEnter={() => setHoveredLog(log.id)}
                onMouseLeave={() => setHoveredLog(null)}
                onMouseDown={(e) => handleBlockMouseDown(e, log)}
              />
              
              {/* 과목명 표시 */}
              {getAngleDifference(startAngle, endAngle) > 15 && (
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold fill-white pointer-events-none select-none"
                >
                  {log.subject}
                </text>
              )}

              {/* 드래그 핸들 (항상 표시) */}
              <>
                {/* 시작 핸들 */}
                <g>
                  <circle
                    cx={startHandleX}
                    cy={startHandleY}
                    r="12"
                    fill={color}
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onMouseDown={(e) => handleEdgeMouseDown(e, log, "start")}
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                  />
                  <text
                    x={startHandleX}
                    y={startHandleY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-white pointer-events-none"
                  >
                    ◀
                  </text>
                </g>
                
                {/* 종료 핸들 */}
                <g>
                  <circle
                    cx={endHandleX}
                    cy={endHandleY}
                    r="12"
                    fill={color}
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onMouseDown={(e) => handleEdgeMouseDown(e, log, "end")}
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                  />
                  <text
                    x={endHandleX}
                    y={endHandleY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-bold fill-white pointer-events-none"
                  >
                    ▶
                  </text>
                </g>
              </>
            </g>
          );
        })}

        {/* 중앙 원 */}
        <circle cx={centerX} cy={centerY} r={innerRadius} fill="white" stroke="#e5e7eb" strokeWidth="3" />
        {draggingState ? (
          <>
            <text
              x={centerX}
              y={centerY - 20}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold fill-foreground"
            >
              {draggingState.type === "move" ? "이동 중" : "크기 조절"}
            </text>
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm fill-muted-foreground"
            >
              {angleToTime(draggingState.startAngle)}
            </text>
            <text
              x={centerX}
              y={centerY + 25}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm fill-muted-foreground"
            >
              → {angleToTime(draggingState.endAngle)}
            </text>
          </>
        ) : (
          <>
            <text
              x={centerX}
              y={centerY - 15}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl font-bold fill-foreground"
            >
              24시간
            </text>
            <text
              x={centerX}
              y={centerY + 20}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-base fill-muted-foreground"
            >
              타임라인
            </text>
          </>
        )}
      </svg>

      {/* 범례 */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center max-w-md">
        {Object.entries(subjectColors).map(([subject, color]) => (
          <div key={subject} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium">{subject}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
