"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function QuizDialog() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quiz, setQuiz] = useState<
    | null
    | {
        question: string;
        correctIndex: number;
        possibleAnswers: string[];
      }[]
  >(null);
  const [chosenAnswerIndex, setChosenAnswerIndex] = useState<number | null>(
    null
  );

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          (async () => {
            await new Promise((resolve, reject) => {
              setTimeout(resolve, 2000);
            });
            setQuiz([
              {
                question: "How did Rosamond know who Cousin Penny was?",
                correctIndex: 2,
                possibleAnswers: [
                  "From a photo",
                  "By introductions",
                  "From her father’s description",
                  "She guessed",
                ],
              },
              {
                question: "What did Miss Penelope do after Rosamond spoke?",
                correctIndex: 0,
                possibleAnswers: [
                  "Hid behind the letter",
                  "Laughed loudly",
                  "Scolded Rosamond",
                  "Left the room",
                ],
              },
              {
                question: "What happened when Miss Henrietta frowned?",
                correctIndex: 1,
                possibleAnswers: [
                  "Her hat fell off",
                  "Her glasses flew off",
                  "She dropped her sewing",
                  "She stood up angrily",
                ],
              },
              {
                question: "How did Miss Cicely react to Rosamond’s words?",
                correctIndex: 3,
                possibleAnswers: [
                  "Stayed silent",
                  "Looked upset",
                  "Left the room",
                  "Laughed and joked",
                ],
              },
              {
                question:
                  "What did Rosamond do after Miss Henny told her to sit?",
                correctIndex: 2,
                possibleAnswers: [
                  "Ran away",
                  "Cried softly",
                  "Sat quietly in a chair",
                  "Asked more questions",
                ],
              },
            ]);
          })();
        }
      }}
    >
      <form onMouseDown={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <Button className="absolute top-10 left-1/2 -translate-x-1/2 text-xl">
            Quiz
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Question {questionIndex + 1} / 5</DialogTitle>
          </DialogHeader>
          {quiz && (
            <>
              <div>
                <h2>How did Rosamond know who Cousin Penny was?</h2>
                <div className="grid grid-cols-1 gap-2 mt-5">
                  {quiz[questionIndex].possibleAnswers.map((answer, i) => (
                    <Button
                      className={`${
                        chosenAnswerIndex === i &&
                        i === quiz[questionIndex].correctIndex
                          ? "bg-green-400 hover:bg-green-400 text-black"
                          : chosenAnswerIndex === i
                          ? "bg-red-500 hover:bg-red-500"
                          : ""
                      }`}
                      variant={
                        chosenAnswerIndex !== null && chosenAnswerIndex !== i
                          ? "outline"
                          : "default"
                      }
                      key={answer}
                      onClick={() =>
                        chosenAnswerIndex === null && setChosenAnswerIndex(i)
                      }
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
              </div>
              <DialogFooter>
                {questionIndex + 1 < quiz.length && (
                  <Button
                    type="submit"
                    onClick={() => {
                      setQuestionIndex((prev) => prev + 1);
                      setChosenAnswerIndex(null);
                    }}
                    disabled={chosenAnswerIndex === null}
                  >
                    Next
                  </Button>
                )}
                {questionIndex + 1 >= quiz.length && (
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      onClick={() => {
                        setQuestionIndex(0);
                        setQuiz(null);
                        setChosenAnswerIndex(null);
                      }}
                    >
                      End
                    </Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </>
          )}
          {!quiz && <p>Loading Quiz...</p>}
        </DialogContent>
      </form>
    </Dialog>
  );
}
