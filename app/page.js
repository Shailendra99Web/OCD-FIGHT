'use client'
import MainCouter from "@/components/MainCouter";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector, useAppStore } from "@/redux/hooks"
import { add, replace } from "@/redux/features/allIntervals/allIntervalsSlice";

export default function Home() {

  return (
    <>
      {<MainCouter />}
    </>
  );
}

