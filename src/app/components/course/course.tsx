'use client'
import { useState } from "react";
import Content from "./content"
import UnitPicker from "./unit-picker"
import { Course, Unit } from "@prisma/client";

type CourseWithUnits = Course & {
    Unit: Unit[]
}

export default function CourseView({ data }: { data: CourseWithUnits }) {

    const [modalState, setModalState] = useState(false);
    const [unit, setUnit] = useState<Unit | null>(null);

    return (
        <div className="flex p-6">
            <Content
                courseName={data.name}
                courseDescription={data.description}
                unitName={unit ? unit.name : null}
                unitContent={unit?.content}
            />

            <UnitPicker
                setUnit={setUnit}
                unit={unit}
                units={data.Unit}
                setModalState={setModalState}
                modalState={modalState}
            />
        </div>
    )
}