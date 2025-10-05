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
import { getGroqChatCompletion } from "@/groq";
import { AnyTxtRecord } from "dns";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function QuizDialog({
  onOpenChange,
  selection,
  bookContext,
}: {
  onOpenChange: (open: boolean) => any;
  selection: string;
  bookContext: string;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quiz, setQuiz] = useState<
    | null
    | {
        question: string;
        correct_answer_index: number;
        possible_answers: string[];
      }[]
  >(null);
  const [chosenAnswerIndex, setChosenAnswerIndex] = useState<number | null>(
    null
  );
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        onOpenChange(open);
        if (open) {
          (async () => {
            setQuestionIndex(0);
            setQuiz(null);
            setChosenAnswerIndex(null);
            setShowingCorrectAnswer(false);

            const groqQuiz = await getGroqChatCompletion({
              selectedFragment: selection,
              bookContext: bookContext,
            });
            setQuiz(groqQuiz);
          })();
        } else {
          setQuestionIndex(0);
          setQuiz(null);
          setChosenAnswerIndex(null);
          setShowingCorrectAnswer(false);
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
                <h2>{quiz[questionIndex].question}</h2>
                <div className="grid grid-cols-1 gap-2 mt-5">
                  {quiz[questionIndex].possible_answers.map((answer, i) => (
                    <Button
                      className={`${
                        i === quiz[questionIndex].correct_answer_index &&
                        showingCorrectAnswer
                          ? "bg-green-400 hover:bg-green-400 text-black"
                          : chosenAnswerIndex === i
                          ? "bg-red-500 hover:bg-red-500"
                          : ""
                      }
                      ${
                        i === quiz[questionIndex].correct_answer_index &&
                        showingCorrectAnswer
                          ? "bg-green-400 hover:bg-green-400"
                          : ""
                      }
                      `}
                      variant={
                        chosenAnswerIndex !== null && chosenAnswerIndex !== i
                          ? "outline"
                          : "default"
                      }
                      key={answer}
                      onClick={() => {
                        if (chosenAnswerIndex === null) {
                          setChosenAnswerIndex(i);

                          if (i !== quiz[questionIndex].correct_answer_index) {
                            setTimeout(() => {
                              setShowingCorrectAnswer(true);
                            }, 1000);
                          } else {
                            setShowingCorrectAnswer(true);
                          }
                        }
                      }}
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
                      setShowingCorrectAnswer(false);
                    }}
                    disabled={
                      chosenAnswerIndex === null || !showingCorrectAnswer
                    }
                  >
                    Next
                  </Button>
                )}
                {questionIndex + 1 >= quiz.length && (
                  <DialogClose asChild>
                    <Button
                      disabled={!showingCorrectAnswer}
                      type="submit"
                      onClick={() => {
                        setQuestionIndex(0);
                        setQuiz(null);
                        setChosenAnswerIndex(null);
                        setShowingCorrectAnswer(false);
                      }}
                    >
                      End
                    </Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </>
          )}
          {!quiz && (
            <>
              <div>
                <h2>
                  <Skeleton className="w-[350px] h-[24px]" />
                </h2>
                <div className="grid grid-cols-1 gap-2 mt-5">
                  <Skeleton className="w-full h-[36px]" />
                  <Skeleton className="w-full h-[36px]" />
                  <Skeleton className="w-full h-[36px]" />
                  <Skeleton className="w-full h-[36px]" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled>Next</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}
