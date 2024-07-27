import React, { useState, useRef } from 'react';
import { upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";

const TextExtrusion3D = () => {
  const [text, setText] = useState('3D Text');
  const [shadowLength, setShadowLength] = useState(2);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [svgUrl, setSvgUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const svgRef = useRef(null);

  const fontOptions = [
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Georgia, serif',
    'Palatino, serif',
    'Garamond, serif',
    'Bookman, serif',
    'Comic Sans MS, cursive',
    'Trebuchet MS, sans-serif',
    'Arial Black, sans-serif'
  ];

  const generateSvgUrl = () => {
    const svgElement = svgRef.current;
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      setSvgUrl(url);
    }
  };

  const addToCanva = async () => {
    setIsUploading(true);
    try {
      const svgElement = svgRef.current;
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

        // Upload the SVG to Canva
        const result = await upload({
          type: "IMAGE",
          mimeType: "image/svg+xml",
          url: svgDataUrl,
        });

        // Add the uploaded image to the Canva design
        await addNativeElement({
          type: "IMAGE",
          ref: result.ref,
        });

        alert("3D Text successfully added to your Canva design!");
      }
    } catch (error) {
      console.error("Error adding to Canva:", error);
      alert("Failed to add 3D Text to Canva. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full max-w-md"
        placeholder="Enter text"
      />
      
      <div className="w-full max-w-md">
        <label htmlFor="font-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Font
        </label>
        <select
          id="font-select"
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {fontOptions.map((font, index) => (
            <option key={index} value={font}>{font.split(',')[0]}</option>
          ))}
        </select>
      </div>
      
      <div className="w-full max-w-md">
        <label htmlFor="shadow-length" className="block text-sm font-medium text-gray-700 mb-1">
          Shadow Length: {shadowLength}
        </label>
        <input
          type="range"
          id="shadow-length"
          min="0"
          max="10"
          step="0.1"
          value={shadowLength}
          onChange={(e) => setShadowLength(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" className="w-full max-w-md">
        <defs>
          <filter id="shadow">
            <feOffset dx={shadowLength} dy={shadowLength} />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          </filter>
        </defs>
        
        {/* Extrusion effect */}
        <g filter="url(#shadow)">
          <text x="10" y="50" fontFamily={fontFamily} fontSize="40" fontWeight="bold" fill="#6c5ce7">
            {text}
          </text>
        </g>
        
        {/* Front face of the text */}
        <text x="10" y="50" fontFamily={fontFamily} fontSize="40" fontWeight="bold" fill="#a29bfe">
          {text}
        </text>
      </svg>

      <div className="flex space-x-4">
        <button
          onClick={generateSvgUrl}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Generate SVG URL
        </button>
        <button
          onClick={addToCanva}
          disabled={isUploading}
          className={`px-4 py-2 text-white rounded transition-colors ${
            isUploading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isUploading ? 'Adding to Canva...' : 'Add to Canva'}
        </button>
      </div>

      {svgUrl && (
        <div className="w-full max-w-md">
          <p className="text-sm font-medium text-gray-700 mb-1">SVG URL:</p>
          <a
            href={svgUrl}
            download="3d-text.svg"
            className="block w-full p-2 bg-gray-100 border border-gray-300 rounded text-blue-600 hover:text-blue-800 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {svgUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default TextExtrusion3D;