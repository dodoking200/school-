import React from "react";
import Table from "../ui/Table";

interface Quiz {
  subject: string;
  date: string;
  time: string;
}

const quizzes: Quiz[] = [
  { subject: "History", date: "2024-05-15", time: "10:00 AM" },
  { subject: "Geography", date: "2024-05-20", time: "2:00 PM" },
  { subject: "biology", date: "2024-05-22", time: "10:00 AM" },
  { subject: "math", date: "2024-05-24", time: "2:00 PM" },
  { subject: "english", date: "2024-05-26", time: "10:00 AM" },
  { subject: "spanish", date: "2024-05-28", time: "2:00 PM" },
];

export default function ExamSchedule() {
  return (
    <Table
      title={"Upcoming Quizzes"}
      tableHeader={
        <>
          <th
            scope="col"
            className="  px-6 py-4 text-center text-sm  uppercase tracking-wider"
          >
            Subject
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm  uppercase tracking-wider"
          >
            Date
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-center text-sm  uppercase tracking-wider"
          >
            Time
          </th>
        </>
      }
      tableContent={
        <>
          {quizzes.map((quiz, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{quiz.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {quiz.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                {quiz.time}
              </td>
            </tr>
          ))}
        </>
      }
    />
  );
}
