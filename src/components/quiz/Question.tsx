"use client";

interface Option {
  id: string;
  text: string;
}

interface QuestionProps {
  question: {
    id: number;
    question: string;
    options: Option[];
  };
  selectedAnswer: string | undefined;
  onAnswerSelect: (questionId: number, optionId: string) => void;
}

export default function Question({
  question,
  selectedAnswer,
  onAnswerSelect,
}: QuestionProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
      <div className="space-y-2">
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="radio"
              id={`q${question.id}-o${option.id}`}
              name={`q${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onAnswerSelect(question.id, option.id)}
              className="mr-2"
            />
            <label htmlFor={`q${question.id}-o${option.id}`}>
              {option.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
