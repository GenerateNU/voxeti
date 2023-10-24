// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

type DispatchFunc = () => AppDispatch;

// Typed useDispatch & useSelector hooks to be used throughout project:
export const useStateDispatch: DispatchFunc = useDispatch;
export const useStateSelector: TypedUseSelectorHook<RootState> = useSelector;
