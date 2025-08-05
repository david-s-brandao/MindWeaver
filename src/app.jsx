import { useEffect, useState, useCallback, useRef } from 'react'
import logo from './assets/images/logo.png'
function IconButton({ children, label, onClick }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="w-[42px] h-[42px] flex items-center justify-center bg-transparent border-none p-0 hover:opacity-80 transition"
    >
      {children}
    </button>
  )
}

function App() {
  const [elements, setElements] = useState([]);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [editingElement, setEditingElement] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connections, setConnections] = useState([]);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [canvasTransform, setCanvasTransform] = useState({ scale: 1, translateX: -5000, translateY: -5000 });
  const [selectedElement, setSelectedElement] = useState(null);
  const [editingConnection, setEditingConnection] = useState(null);
  const [connectionMenuPosition, setConnectionMenuPosition] = useState({ x: 0, y: 0 });
  const transformRef = useRef({ scale: 1, translateX: -5000, translateY: -5000 });

  function addElement() {
    const newElement = {
      id: elements.length ? elements[elements.length - 1].id + 1 : 1,
      text: `Element ${elements.length + 1}`,
      x: 5000 + (Math.random() * 400 - 200), 
      y: 5000 + (Math.random() * 400 - 200),
    };
    setElements([...elements, newElement]);
  }

  function deleteSelectedElement() {
    if (selectedElement) {
      // Remove element
      setElements(prev => prev.filter(el => el.id !== selectedElement.id));
      // Remove all connections related to this element
      setConnections(prev => prev.filter(conn => 
        conn.from.elementId !== selectedElement.id && conn.to.elementId !== selectedElement.id
      ));
      setSelectedElement(null);
    }
  }

  function deleteElementConnections(elementId) {
    setConnections(prev => prev.filter(conn => 
      conn.from.elementId !== elementId && conn.to.elementId !== elementId
    ));
  }

  function clearAllConnections() {
    setConnections([]);
  }

  useEffect(() => {
    const viewport = document.getElementById('viewport');
    const canvas = document.getElementById('canvas');
    
    if (!viewport || !canvas) return;

    let isPanning = false;
    let start = { x: 0, y: 0 };
    let translate = { x: transformRef.current.translateX, y: transformRef.current.translateY };
    let scale = transformRef.current.scale;

    function updateTransform() {
      canvas.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
      canvas.style.transformOrigin = '0 0';
      transformRef.current = { scale, translateX: translate.x, translateY: translate.y };
      setCanvasTransform({ scale, translateX: translate.x, translateY: translate.y });
    }

    const handleMouseDown = (e) => {
      if (isDraggingElement) return;
      isPanning = true;
      start.x = e.clientX;
      start.y = e.clientY;
      viewport.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isPanning = false;
      viewport.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
      if (!isPanning || isDraggingElement) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      translate.x += dx;
      translate.y += dy;
      start.x = e.clientX;
      start.y = e.clientY;
      updateTransform();
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      
      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const canvasMouseX = (mouseX - translate.x) / scale;
      const canvasMouseY = (mouseY - translate.y) / scale;
      const newScale = Math.min(Math.max(scale * delta, 0.1), 10);
      translate.x = mouseX - canvasMouseX * newScale;
      translate.y = mouseY - canvasMouseY * newScale;
      scale = newScale;
      updateTransform();
    };

    const hasInitialTransform = canvas.style.transform && canvas.style.transform !== 'none';
    if (!hasInitialTransform) {
      updateTransform();
    }

    viewport.addEventListener('mousedown', handleMouseDown);
    viewport.addEventListener('mouseup', handleMouseUp);
    viewport.addEventListener('mousemove', handleMouseMove);
    viewport.addEventListener('wheel', handleWheel);
    
    return () => {
      viewport.removeEventListener('mousedown', handleMouseDown);
      viewport.removeEventListener('mouseup', handleMouseUp);
      viewport.removeEventListener('mousemove', handleMouseMove);
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [isDraggingElement]);
  return (
    <div className="w-full h-screen flex  justify-center overflow-hidden bg-gray-100 ">
      <div className="flex fixed items-center justify-between z-50 bg-white px-4 py-2 my-4 rounded-full shadow-md border border-gray-300 max-w-fit mx-auto">

        <div className="flex items-center gap-2 pl-2 pr-4">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl pacifico font-serif">Mind-Weaver</h1>
        </div>
        <div className="text-gray-300 px-2 select-none">|</div>

        <div className="flex items-center gap-2">
          <IconButton label="Back to Home" onClick={() => window.location.reload()}>
            <svg fill="#434242" width="20" height="20" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </IconButton>
        </div>

        <div className="text-gray-300 px-2 select-none">|</div>

        <div className="flex items-center gap-2">
          <IconButton label="Undo">
            <svg fill="#434242" viewBox="0 0 16 16" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z" />
            </svg>
          </IconButton>

          <IconButton label="Redo">
            <svg fill="#434242" viewBox="0 0 16 16" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 1H12L16 5L12 9H11V6H5C3.34315 6 2 7.34315 2 9C2 10.6569 3.34315 12 5 12H12V14H5C2.23858 14 0 11.7614 0 9C0 6.23858 2.23858 4 5 4H11V1Z" />
            </svg>
          </IconButton>

          <div className="text-gray-300 px-2 select-none">|</div>

          <IconButton label="Copy">
            <svg fill="#434242" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 17H6a2 2 0 0 1-2-2V7H4a2 2 0 0 1 2-2h10v2H6v8h2v2Zm4 4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8Zm0-2h8V9h-8v10Z"/>
            </svg>
          </IconButton>

          <IconButton label="Save">
            <svg width="20" height="20" fill="#434242" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 17H17.01M15.6 14H18C19.1 14 20 14.9 20 16V17C20 18.1 19.1 19 18 19H6C4.9 19 4 18.1 4 17V16C4 14.9 4.9 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" stroke="#434242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </IconButton>
        </div>

        <div className="text-gray-300 px-2 select-none">|</div>
        <div className="flex items-center gap-2 pr-2">
          <IconButton label="Add" onClick={addElement}>
            <svg fill="#434242" width="20" height="20" viewBox="0 0 24 24">
              <path d="M19 11H13V5H11V11H5V13H11V19H13V13H19Z" />
            </svg>
          </IconButton>

          <IconButton label="Delete" onClick={deleteSelectedElement}>
            <svg fill={selectedElement ? "#dc2626" : "#434242"} width="20" height="20" viewBox="0 0 24 24">
              <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
            </svg>
          </IconButton>

          <IconButton label="Clear All Connections" onClick={clearAllConnections}>
            <svg width="20" height="20" viewBox="0 -0.5 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="si-glyph si-glyph-erase">
                <title>797</title>
                <defs>
            </defs>
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(1.000000, 0.000000)" fill="#434343">
                        <path d="M8.932,13.014 L2.958,7.039 L9.84,0.158 C10.162,-0.167 10.696,-0.156 11.031,0.18 L15.793,4.939 C16.127,5.275 16.138,5.808 15.814,6.13 L8.932,13.014 L8.932,13.014 Z" className="si-glyph-fill">
            </path>
                        <path d="M7.963,14.11 C6.381,15.693 2.529,14.41 0.861,12.742 C-0.805,11.075 0.341,9.655 1.924,8.072 L7.963,14.11 L7.963,14.11 Z" className="si-glyph-fill">
            </path>
                    </g>
                </g>
            </svg>
          </IconButton>

          <IconButton label="Settings">
            <svg fill="#434242" width="20" height="20" viewBox="0 0 24 24">
              <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5ZM19.43 12.98C19.46 12.66 19.5 12.33 19.5 12C19.5 11.67 19.46 11.34 19.43 11.02L21.54 9.37C21.73 9.21 21.78 8.94 21.66 8.72L19.66 5.27C19.55 5.07 19.31 4.99 19.1 5.06L16.56 6.03C16.04 5.65 15.48 5.34 14.87 5.13L14.5 2.5C14.47 2.22 14.24 2 13.95 2H10.05C9.76 2 9.53 2.22 9.5 2.5L9.13 5.13C8.52 5.34 7.96 5.65 7.44 6.03L4.9 5.06C4.69 4.99 4.45 5.07 4.34 5.27L2.34 8.72C2.22 8.94 2.27 9.21 2.46 9.37L4.57 11.02C4.54 11.34 4.5 11.67 4.5 12C4.5 12.33 4.54 12.66 4.57 12.98L2.46 14.63C2.27 14.79 2.22 15.06 2.34 15.28L4.34 18.73C4.45 18.93 4.69 19.01 4.9 18.94L7.44 17.97C7.96 18.35 8.52 18.66 9.13 18.87L9.5 21.5C9.53 21.78 9.76 22 10.05 22H13.95C14.24 22 14.47 21.78 14.5 21.5L14.87 18.87C15.48 18.66 16.04 18.35 16.56 17.97L19.1 18.94C19.31 19.01 19.55 18.93 19.66 18.73L21.66 15.28C21.78 15.06 21.73 14.79 21.54 14.63L19.43 12.98Z" />
            </svg>
          </IconButton>
        </div>
      </div>

      <div id="viewport" className="w-screen h-screen overflow-hidden relative bg-white cursor-grab">
  <div
    id="canvas"
    className="absolute bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:40px_40px]"
    style={{
      width: '10000px',
      height: '10000px',
      transform: 'translate(-5000px, -5000px) scale(1)',
      transformOrigin: '0 0'
    }}
    onClick={() => {
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
        setHoveredElement(null);
      }
      setSelectedElement(null);
    }}
  >
    {elements.map((element) => {
      const getSizeClasses = (size) => {
        switch (size) {
          case 'small': return 'p-2 text-xs min-w-24 min-h-8';
          case 'large': return 'p-6 text-lg min-w-48 min-h-20';
          case 'xlarge': return 'p-8 text-xl min-w-64 min-h-24';
          default: return 'p-4 text-sm min-w-36 min-h-12';
        }
      };

      return (
        <div 
          key={element.id}
          className={`element absolute ${element.color || 'bg-blue-500'} text-white rounded-lg shadow-lg select-none hover:opacity-90 transition-all border-2 ${
            selectedElement?.id === element.id ? 'border-red-500 border-4' : 'border-gray-300'
          } ${getSizeClasses(element.size)} ${isDraggingElement ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            textAlign: 'center',
            fontWeight: 'bold',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
          }}
          onMouseEnter={() => setHoveredElement(element.id)}
          onMouseLeave={() => !isConnecting && setHoveredElement(null)}
          onClick={(e) => {
            if (!isDraggingElement && !isConnecting) {
              e.stopPropagation();
              setSelectedElement(element);
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsDraggingElement(true);
            
            const canvas = document.getElementById('canvas');
            const viewport = document.getElementById('viewport');
            const style = window.getComputedStyle(canvas);
            const matrix = new DOMMatrix(style.transform);
            const scale = matrix.a;
            const translateX = matrix.e;
            const translateY = matrix.f;
            const rect = viewport.getBoundingClientRect();
            const startMouseX = e.clientX - rect.left;
            const startMouseY = e.clientY - rect.top;
            const startCanvasX = (startMouseX - translateX) / scale;
            const startCanvasY = (startMouseY - translateY) / scale;
            const offsetX = startCanvasX - element.x;
            const offsetY = startCanvasY - element.y;
            let isDragging = true;
            let animationId = null;
   
   
            const handleMouseMove = (e) => {
              if (!isDragging) return;
              if (animationId) {
                cancelAnimationFrame(animationId);
              }
              
              animationId = requestAnimationFrame(() => {
                const rect = viewport.getBoundingClientRect();
                const currentMouseX = e.clientX - rect.left;
                const currentMouseY = e.clientY - rect.top;
                const canvasX = (currentMouseX - translateX) / scale;
                const canvasY = (currentMouseY - translateY) / scale;
                const newX = canvasX - offsetX;
                const newY = canvasY - offsetY;

                setElements(prev => prev.map(el => 
                  el.id === element.id 
                    ? { ...el, x: newX, y: newY }
                    : el
                ));
              });
            };
            
            const handleMouseUp = () => {
              isDragging = false;
              setIsDraggingElement(false);
              
              if (animationId) {
                cancelAnimationFrame(animationId);
              }
              
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          onDoubleClick={(e) => {
            setEditingElement(element);
            e.stopPropagation();
          }}
        >
          {element.text}
          {(hoveredElement === element.id || isConnecting) && (
            <>
              <div
                className="absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-200 hover:border-blue-500 transition-colors"
                style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  
                  if (!isConnecting) {
                    setIsConnecting(true);
                    setConnectionStart({ elementId: element.id, side: 'top' });
                  } else if (connectionStart && connectionStart.elementId !== element.id) {
                    const newConnection = {
                      id: Date.now(),
                      from: connectionStart,
                      to: { elementId: element.id, side: 'top' },
                      color: '#666',
                      strokeWidth: 2,
                      type: 'solid',
                      arrowType: 'arrow'
                    };
                    setConnections(prev => [...prev, newConnection]);
                    setIsConnecting(false);
                    setConnectionStart(null);
                    setHoveredElement(null);
                  }
                }}
              />
              <div
                className="absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-200 hover:border-blue-500 transition-colors"
                style={{ top: '50%', right: '-6px', transform: 'translateY(-50%)', zIndex: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isConnecting) {
                    setIsConnecting(true);
                    setConnectionStart({ elementId: element.id, side: 'right' });
                  } else if (connectionStart && connectionStart.elementId !== element.id) {
                    const newConnection = {
                      id: Date.now(),
                      from: connectionStart,
                      to: { elementId: element.id, side: 'right' },
                      color: '#666',
                      strokeWidth: 2,
                      type: 'solid',
                      arrowType: 'arrow'
                    };
                    setConnections(prev => [...prev, newConnection]);
                    setIsConnecting(false);
                    setConnectionStart(null);
                    setHoveredElement(null);
                  }
                }}
              />
              <div
                className="absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-200 hover:border-blue-500 transition-colors"
                style={{ bottom: '-6px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  
                  if (!isConnecting) {
                    setIsConnecting(true);
                    setConnectionStart({ elementId: element.id, side: 'bottom' });
                  } else if (connectionStart && connectionStart.elementId !== element.id) {
                    const newConnection = {
                      id: Date.now(),
                      from: connectionStart,
                      to: { elementId: element.id, side: 'bottom' },
                      color: '#666',
                      strokeWidth: 2,
                      type: 'solid',
                      arrowType: 'arrow'
                    };
                    setConnections(prev => [...prev, newConnection]);
                    setIsConnecting(false);
                    setConnectionStart(null);
                    setHoveredElement(null);
                  }
                }}
              />
              <div
                className="absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full cursor-pointer hover:bg-blue-200 hover:border-blue-500 transition-colors"
                style={{ top: '50%', left: '-6px', transform: 'translateY(-50%)', zIndex: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isConnecting) {
                    setIsConnecting(true);
                    setConnectionStart({ elementId: element.id, side: 'left' });
                  } else if (connectionStart && connectionStart.elementId !== element.id) {
                    const newConnection = {
                      id: Date.now(),
                      from: connectionStart,
                      to: { elementId: element.id, side: 'left' },
                      color: '#666',
                      strokeWidth: 2,
                      type: 'solid',
                      arrowType: 'arrow'
                    };
                    setConnections(prev => [...prev, newConnection]);
                    setIsConnecting(false);
                    setConnectionStart(null);
                    setHoveredElement(null);
                  }
                }}
              />
            </>
          )}
        </div>
      );
    })}
  </div>
  <svg 
    className="absolute inset-0 pointer-events-none" 
    style={{ width: '100%', height: '100%', zIndex: 15 }}
  >
    {connections.map((connection) => {
      const fromElement = elements.find(el => el.id === connection.from.elementId);
      const toElement = elements.find(el => el.id === connection.to.elementId);
      if (!fromElement || !toElement) return null;
      const { scale, translateX, translateY } = canvasTransform;
      const getConnectionPoint = (element, side) => {
        const baseX = element.x;
        const baseY = element.y;
        let width = 144;
        let height = 48;
        if (element.size === 'small') { width = 96; height = 32; }
        else if (element.size === 'large') { width = 192; height = 80; }
        else if (element.size === 'xlarge') { width = 256; height = 96; }
        let canvasX, canvasY;
        switch (side) {
          case 'top': 
            canvasX = baseX + width/2;
            canvasY = baseY;
            break;
          case 'right': 
            canvasX = baseX + width;
            canvasY = baseY + height/2;
            break;
          case 'bottom': 
            canvasX = baseX + width/2;
            canvasY = baseY + height;
            break;
          case 'left': 
            canvasX = baseX;
            canvasY = baseY + height/2;
            break;
          default: 
            canvasX = baseX + width/2;
            canvasY = baseY + height/2;
        }
        const viewportX = canvasX * scale + translateX;
        const viewportY = canvasY * scale + translateY;
        return { x: viewportX, y: viewportY };
      };
      
      const fromPoint = getConnectionPoint(fromElement, connection.from.side);
      const toPoint = getConnectionPoint(toElement, connection.to.side);
      
      return (
        <g key={connection.id}>
          <line
            x1={fromPoint.x}
            y1={fromPoint.y}
            x2={toPoint.x}
            y2={toPoint.y}
            stroke="transparent"
            strokeWidth="8"
            cursor="pointer"
            style={{ pointerEvents: 'stroke' }}
            onClick={(e) => {
              e.stopPropagation();
              setEditingConnection(connection);
              setConnectionMenuPosition({
                x: e.clientX,
                y: e.clientY
              });
            }}
          />
          <line
            x1={fromPoint.x}
            y1={fromPoint.y}
            x2={toPoint.x}
            y2={toPoint.y}
            stroke={connection.color || "#666"}
            strokeWidth={connection.strokeWidth || "2"}
            strokeDasharray={connection.type === 'dashed' ? "5,5" : "none"}
            markerEnd={connection.arrowType !== 'none' ? `url(#arrowhead-${connection.id})` : "none"}
            style={{ pointerEvents: 'none' }}
          />
        </g>
      );
    })}
    
    <defs>
      {connections.map((connection) => {
        if (connection.arrowType === 'none') return null;
        
        if (connection.arrowType === 'circle') {
          return (
            <marker
              key={connection.id}
              id={`arrowhead-${connection.id}`}
              markerWidth="4"
              markerHeight="4"
              refX="2"
              refY="2"
              orient="auto"
            >
              <circle
                cx="2"
                cy="2"
                r="1.5"
                fill={connection.color || "#666"}
              />
            </marker>
          );
        }
        
        return (
          <marker
            key={connection.id}
            id={`arrowhead-${connection.id}`}
            markerWidth="4"
            markerHeight="3"
            refX="3.5"
            refY="1.5"
            orient="auto"
          >
            <polygon
              points="0 0, 4 1.5, 0 3"
              fill={connection.color || "#666"}
            />
          </marker>
        );
      })}
    </defs>
  </svg>
</div>

      {/* Element editor modal */}
      {editingElement && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="flex-1"
            onClick={() => setEditingElement(null)}
          ></div>
          <div className="w-80 h-full bg-white shadow-2xl overflow-y-auto border-l border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Edit Element</h2>
                <button
                  onClick={() => setEditingElement(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editingElement.text}
                    onChange={(e) => {
                      const newText = e.target.value;
                      setElements(prev => prev.map(el => 
                        el.id === editingElement.id 
                          ? { ...el, text: newText }
                          : el
                      ));
                      setEditingElement({ ...editingElement, text: newText });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Element title"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Azul', bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
                    { name: 'Verde', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
                    { name: 'Vermelho', bg: 'bg-red-500', hover: 'hover:bg-red-600' },
                    { name: 'Roxo', bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
                    { name: 'Amarelo', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
                    { name: 'Rosa', bg: 'bg-pink-500', hover: 'hover:bg-pink-600' },
                    { name: 'Cinza', bg: 'bg-gray-500', hover: 'hover:bg-gray-600' },
                    { name: 'Laranja', bg: 'bg-orange-500', hover: 'hover:bg-orange-600' },
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setElements(prev => prev.map(el => 
                          el.id === editingElement.id 
                            ? { ...el, color: color.bg }
                            : el
                        ));
                        setEditingElement({ ...editingElement, color: color.bg });
                      }}
                      className={`w-full h-10 rounded-lg ${color.bg} ${color.hover} transition-colors border-2 ${
                        (editingElement.color || 'bg-blue-500') === color.bg 
                          ? 'border-gray-800' 
                          : 'border-transparent'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const sizes = { S: 'small', M: 'medium', L: 'large', XL: 'xlarge' };
                        setElements(prev => prev.map(el => 
                          el.id === editingElement.id 
                            ? { ...el, size: sizes[size] }
                            : el
                        ));
                        setEditingElement({ ...editingElement, size: sizes[size] });
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        (editingElement.size || 'medium') === { S: 'small', M: 'medium', L: 'large', XL: 'xlarge' }[size]
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <button
                  onClick={() => {
                    deleteElementConnections(editingElement.id);
                  }}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                 
                  Delete Element Connections
                </button>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setEditingElement(null)}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu contextual para conexões */}
      {editingConnection && connectionMenuPosition && (
        <>
          {/* Overlay para fechar o menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setEditingConnection(null);
              setConnectionMenuPosition(null);
            }}
          />
          
          {/* Menu contextual */}
          <div
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-48"
            style={{
              left: connectionMenuPosition.x,
              top: connectionMenuPosition.y,
              transform: 'translate(-50%, -10px)'
            }}
          >
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Style</label>
              <select
                value={editingConnection.type || 'solid'}
                onChange={(e) => {
                  const newType = e.target.value;
                  setConnections(prev => prev.map(conn => 
                    conn.id === editingConnection.id 
                      ? { ...conn, type: newType }
                      : conn
                  ));
                  setEditingConnection({ ...editingConnection, type: newType });
                }}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="solid">Solid Line</option>
                <option value="dashed">Dashed Line</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Arrow Tip</label>
              <select
                value={editingConnection.arrowType || 'arrow'}
                onChange={(e) => {
                  const newArrowType = e.target.value;
                  setConnections(prev => prev.map(conn => 
                    conn.id === editingConnection.id 
                      ? { ...conn, arrowType: newArrowType }
                      : conn
                  ));
                  setEditingConnection({ ...editingConnection, arrowType: newArrowType });
                }}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="arrow">Arrow</option>
                <option value="circle">Circle</option>
                <option value="none">No Tip</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
              <select
                value={editingConnection.strokeWidth || 2}
                onChange={(e) => {
                  const newWidth = Number(e.target.value);
                  setConnections(prev => prev.map(conn => 
                    conn.id === editingConnection.id 
                      ? { ...conn, strokeWidth: newWidth }
                      : conn
                  ));
                  setEditingConnection({ ...editingConnection, strokeWidth: newWidth });
                }}
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={1}>Thin (1px)</option>
                <option value={2}>Normal (2px)</option>
                <option value={3}>Thick (3px)</option>
                <option value={4}>Very Thick (4px)</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
              <div className="grid grid-cols-6 gap-1">
                {['#666', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setConnections(prev => prev.map(conn => 
                        conn.id === editingConnection.id 
                          ? { ...conn, color }
                          : conn
                      ));
                      setEditingConnection({ ...editingConnection, color });
                    }}
                    className={`w-6 h-6 rounded border-2 transition-all ${
                      editingConnection.color === color ? 'border-gray-800 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setConnections(prev => prev.filter(conn => conn.id !== editingConnection.id));
                setEditingConnection(null);
                setConnectionMenuPosition(null);
              }}
              className="w-full px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete Connection
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default App;
