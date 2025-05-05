import React, { useState } from "react";

const AiImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert("Промпт енгізіңіз!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

     
      setGeneratedImages((prevImages) => [...prevImages, imageUrl]);
    } catch (error) {
      console.error("Қате орын алды:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <textarea
        className="w-full p-2 border rounded-lg"
        placeholder="Сурет үшін промпт енгізіңіз..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={generateImage}
        disabled={loading}
      >
        {loading ? "Генерация..." : "Сурет жасау"}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {generatedImages.map((image, index) => (
          <img key={index} src={image} alt={`Generated ${index}`} className="rounded-lg shadow-md" />
        ))}
      </div>
    </div>
  );
};

export default AiImageGenerator;
