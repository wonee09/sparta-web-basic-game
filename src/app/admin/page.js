"use client";

import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Spacer,
} from "@nextui-org/react";
import React from "react";
import { supabase } from "../../../lib/initSupabase";

const Page = () => {
  const [guess, setGuess] = React.useState("");

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
            <Button color="primary" variant="ghost">
              로그인
            </Button>
            <Button color="warning" variant="ghost">
              회원가입
            </Button>
          </aside>
        </section>
      </header>
      <section className="flex flex-col items-center">
        <p className="text-center m-4 text-xl">관리자 화면입니다</p>
        <Spacer y={8} />
        <Card className="max-w-[50%] min-w-[400px]">
          <CardBody className="flex flex-col gap-4">
            <Input
              placeholder="정답을 입력해주세요."
              onChange={(e) => {
                setGuess(e.target.value);
              }}
              value={guess}
            />
            <Button
              color="primary"
              variant="ghost"
              onClick={async () => {
                if (guess.length <= 1) {
                  alert("정답을 2글자 이상 입력해주세요.");
                  return false;
                }

                const password = prompt("비밀번호를 입력해주세요.", {
                  inputType: "password",
                });
                if (password !== "wnslaaks90!") {
                  alert("비밀번호가 틀렸습니다.");
                  return false;
                }

                const confirm = window.confirm(
                  `정답을 ${guess}로 변경하시겠습니까?`
                );

                if (confirm) {
                  const response = await supabase
                    .from("answer")
                    .update({ answer: guess })
                    .eq("id", 1);
                  console.log(response);
                  alert("정답이 변경되었습니다.");
                }
              }}
            >
              정답 변경하기
            </Button>
          </CardBody>
        </Card>
      </section>
      <footer className="absolute bottom-0 w-full text-center p-5 bg-red-100">
        스파르타 웹트랙 3기
      </footer>
    </main>
  );
};

export default Page;
