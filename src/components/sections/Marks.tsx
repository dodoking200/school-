import React, { useState } from "react";
interface MarksTypes {
  id: number;
  type: string;
}
interface MarkKind {
  oralExam: number;
  midTermExam: number;
  test: number;
  quiz: number;
}
interface SubjectsMark {
  subject: string;
  firstHalf: MarkKind;
  secondHalf: MarkKind;
}

export default function Marks() {
  const [semester, setSemester] = useState("1");
  const markstypes: MarksTypes[] = [
    { id: 1, type: "Oral Exam (10)" },
    { id: 2, type: "Quiz (10)" },
    { id: 3, type: "Test (20)" },
    { id: 4, type: "Mid Term Exam (60)" },
  ];

  const subjectsmark: SubjectsMark[] = [
    {
      subject: "Computer seince",
      firstHalf: { oralExam: 2, midTermExam: 4, test: 65, quiz: 3 },
      secondHalf: { oralExam: 20, midTermExam: 40, test: 650, quiz: 30 },
    },
    {
      subject: "English",
      firstHalf: { oralExam: 2, midTermExam: 4, test: 65, quiz: 3 },
      secondHalf: { oralExam: 20, midTermExam: 40, test: 650, quiz: 30 },
    },
    {
      subject: "Freinsh",
      firstHalf: { oralExam: 2, midTermExam: 4, test: 65, quiz: 3 },
      secondHalf: { oralExam: 20, midTermExam: 40, test: 650, quiz: 30 },
    },
    {
      subject: "Araibc",
      firstHalf: { oralExam: 2, midTermExam: 4, test: 65, quiz: 3 },
      secondHalf: { oralExam: 20, midTermExam: 40, test: 650, quiz: 30 },
    },
    {
      subject: "Chemistry",
      firstHalf: { oralExam: 2, midTermExam: 4, test: 65, quiz: 3 },
      secondHalf: { oralExam: 20, midTermExam: 40, test: 650, quiz: 30 },
    },
    {
      subject: "Physics",
      firstHalf: { oralExam: 2, midTermExam: 4, test: 65, quiz: 3 },
      secondHalf: { oralExam: 20, midTermExam: 40, test: 650, quiz: 30 },
    },
    {
      subject: "Mathematics",
      firstHalf: { oralExam: 2, midTermExam: 4, test: 65, quiz: 3 },
      secondHalf: { oralExam: 20, midTermExam: 40, test: 650, quiz: 30 },
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className=" flex-wrap flex justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-black">Marks</h2>
          </div>
          <div className=" text-black">
            <select
              name="semester"
              className="  rounded-4xl bg-gray-200 p-2"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="1">first semester</option>
              <option value="2">second semester</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-4xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th
                  scope="col"
                  className="px-6 py-4 w-[20%] text-left text-sm  text-black font-bold uppercase tracking-wider"
                >
                  Subject
                </th>
                {markstypes.map((type) => (
                  <th
                    key={type.id}
                    scope="col"
                    className="px-6 py-4  w-[20%] text-left text-sm font-medium text-black uppercase tracking-wider"
                  >
                    {type.type}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjectsmark.map((subject, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap  font-medium text-gray-900">
                    {subject.subject}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap  text-gray-500">
                    {semester == "1"
                      ? subject.firstHalf.oralExam
                      : subject.secondHalf.oralExam}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-gray-500">
                    {semester == "1"
                      ? subject.firstHalf.quiz
                      : subject.secondHalf.quiz}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-gray-500">
                    {semester == "1"
                      ? subject.firstHalf.test
                      : subject.secondHalf.test}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-gray-500">
                    {semester == "1"
                      ? subject.firstHalf.midTermExam
                      : subject.secondHalf.midTermExam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
