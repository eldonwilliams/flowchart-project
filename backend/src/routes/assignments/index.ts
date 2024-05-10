import { Application } from "express";
import Grade from "./grade";

export default function Assignments(app: Application) {
    Grade(app);
}