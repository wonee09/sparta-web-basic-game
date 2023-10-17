"use client";

import React, { useEffect } from "react";
import { supabase } from "../../lib/initSupabase";
import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Spacer,
} from "@nextui-org/react";

export default function Home() {
  const [answer, setAnswer] = React.useState("");
  const [guess, setGuess] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isDone, setIsDone] = React.useState(false);

  const [submitHistories, setSubmitHistories] = React.useState([]);

  const doNothing = () => {
    alert("사실 아무 기능도 안해요... 😂");
  };

  useEffect(() => {
    const fetchAnswer = async () => {
      const { data: answer } = await supabase.from("answer").select("*");
      const { data: histories } = await supabase
        .from("submitHistories")
        .select("*");
      setAnswer(answer[0].answer);
      setSubmitHistories(histories);
      setIsDone(histories.some((h) => h.isCorrect === true));
    };

    fetchAnswer();
  }, []);

  return (
    <main className="relative h-screen">
      <header className="flex flex-col justify-center bg-red-100 p-4">
        <section className="flex justify-between items-center">
          <Image
            alt="logo"
            src="https://s3.ap-northeast-2.amazonaws.com/materials.spartacodingclub.kr/free/logo_teamsparta.png"
            width={50}
          />
          <aside className="flex gap-4">
            <Button color="primary" variant="ghost" onClick={doNothing}>
              로그인
            </Button>
            <Button color="warning" variant="ghost" onClick={doNothing}>
              회원가입
            </Button>
          </aside>
        </section>
      </header>
      <section className="flex flex-col items-center">
        <p className="text-center m-4 text-xl">스무고개 게임 with </p>
        <Image
          src="https://www.biz-con.co.kr/upload/images/202201/400_20220110114052876.jpg"
          alt="starbucks"
          width={100}
        />

        {isDone ? answer : ""}
        <Spacer y={8} />
        <div className="flex gap-4">
          <Card className="max-w-[50%] min-w-[400px]">
            <CardBody className="flex flex-col gap-4">
              <Input
                label="당신의 이름을 입력해주세요."
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
              <Input
                label="전화번호(상품제공용 / 하이픈(-) 없이 입력해주세요.)"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                value={phone}
              />
              <Input
                label="정답을 입력해주세요."
                onChange={(e) => {
                  setGuess(e.target.value);
                }}
                value={guess}
              />
              <Button
                isDisabled={isDone}
                color="primary"
                variant="ghost"
                onClick={async () => {
                  const check = submitHistories.find(
                    (history) => history.name === name
                  );

                  if (check) {
                    alert("이미 제출한 이력이 존재해서, 제출할 수 없어요 🥲");
                    return false;
                  }

                  const { data: temp } = await supabase
                    .from("submitHistories")
                    .select("*");

                  if (temp.some((t) => t.isCorrect)) {
                    alert("이미종료된 게임입니다.");
                    return false;
                  }

                  if (temp.some((t) => t.name === name)) {
                    alert("이미 제출한 이력이 존재해서, 제출할 수 없어요 🥲");
                    return false;
                  }

                  if (guess.length <= 1) {
                    alert("정답을 2글자 이상 입력해주세요.");
                    return false;
                  }

                  if (phone.length <= 10 || phone.includes("-")) {
                    alert("전화번호는 11자리이며, - 없이 입력해주세요.");
                    return false;
                  }

                  if (name.length <= 1) {
                    alert("이름을 2글자 이상 입력해주세요.");
                    return false;
                  }

                  const confirm = window.confirm(
                    `입력하신 답 : ${guess}
제출하시겠습니까?`
                  );

                  if (!confirm) {
                    return false;
                  }

                  if (guess === answer) {
                    alert("정답입니다! 축하합니다 :)");
                    const response = await supabase
                      .from("submitHistories")
                      .insert({
                        answer: guess,
                        name,
                        isCorrect: true,
                        phone,
                      });
                  } else {
                    alert("오답입니다 ㅠㅠ");
                    const response = await supabase
                      .from("submitHistories")
                      .insert({
                        answer: guess,
                        name,
                        isCorrect: false,
                        phone,
                      });
                  }

                  setAnswer("");
                  setGuess("");
                  setName("");
                  setPhone("");
                }}
              >
                {isDone ? "게임종료" : "정답 제출하기"}
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="max-h-[300px] min-w-[400px] overflow-auto">
              {submitHistories.length > 0
                ? submitHistories
                    .sort((a, b) => b.id - a.id)
                    .map((history) => {
                      return (
                        <section key={history.id}>
                          <Spacer y={4} />
                          <p
                            className={`text-xs ${
                              history.isCorrect ? "text-red-600" : "text-black"
                            }`}
                          >
                            [{new Date(history.created_at).toLocaleTimeString()}
                            ] {history.name}님이 제출한 정답 : {history.answer}{" "}
                            ({history.isCorrect ? "정답" : "오답"})
                          </p>
                        </section>
                      );
                    })
                : "아직 제출된 이력이 없습니다."}
            </CardBody>
          </Card>
        </div>
      </section>
      <footer className="absolute bottom-0 w-full text-center p-5 bg-red-100">
        스파르타 웹트랙 3기
      </footer>
    </main>
  );
}
