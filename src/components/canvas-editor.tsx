"use client"

import * as React from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import useImage from "use-image"
import type { CanvasItem } from "@/lib/types"
import type Konva from "konva"

interface CanvasEditorProps {
  stageRef: React.RefObject<Konva.Stage>
  items: CanvasItem[]
  setItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  onStageMouseDown: (e: any) => void
}

interface CanvasImageProps {
  item: CanvasItem
  isSelected: boolean
  onSelect: () => void
  onChange: (newAttrs: Partial<CanvasItem>) => void
}

const CanvasImage: React.FC<CanvasImageProps> = ({ item, isSelected, onSelect, onChange }) => {
  const [image] = useImage(item.src, "anonymous")
  const shapeRef = React.useRef<Konva.Image>(null)
  const trRef = React.useRef<Konva.Transformer>(null)

  React.useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() })
        }}
        onTransformEnd={() => {
          const node = shapeRef.current
          if (node) {
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()
            node.scaleX(1)
            node.scaleY(1)
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
              rotation: node.rotation(),
            })
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

export function CanvasEditor({
  stageRef,
  items,
  setItems,
  selectedId,
  setSelectedId,
  onStageMouseDown,
}: CanvasEditorProps) {
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full bg-gray-100 dark:bg-gray-800">
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        onMouseDown={onStageMouseDown}
        onTouchStart={onStageMouseDown}
      >
        <Layer>
          {items.map((item) => (
            <CanvasImage
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={() => setSelectedId(item.id)}
              onChange={(newAttrs) => {
                setItems((prevItems) => prevItems.map((i) => (i.id === item.id ? { ...i, ...newAttrs } : i)))
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

