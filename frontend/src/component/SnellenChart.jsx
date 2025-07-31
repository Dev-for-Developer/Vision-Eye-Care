const chartLines = [
  { size: "text-6xl", text: "E" },
  { size: "text-5xl", text: "F P" },
  { size: "text-4xl", text: "T O Z" },
  { size: "text-3xl", text: "L P E D" },
  { size: "text-2xl", text: "P E C F D" },
  { size: "text-xl",  text: "E D F C Z P" },
  { size: "text-lg",  text: "F E L O P Z D" },
];

export default function SnellenChart() {
  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {chartLines.map((line, index) => (
        <p key={index} className={`${line.size} font-bold`}>
          {line.text}
        </p>
      ))}
    </div>
  );
}
