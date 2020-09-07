import React, { useState, useEffect } from "react"
import DateObject from "react-date-object"
import Arrow from "../arrow/arrow"
import Input from "../input/input"

export default function TimePicker({ state, setState, onChange }) {
    const [am, setAm] = useState(true)
    const [mustDisplayMeridiem, setMustDisplayMeridiem] = useState(false)
    const [meridiems] = useState(new DateObject({ calendar: state.calendar, local: state.local }).meridiems)

    useEffect(() => {
        const $mustDisplayMeridiem = state.format && (state.format.toLowerCase().includes("a") || state.format.includes("hh"))

        setMustDisplayMeridiem($mustDisplayMeridiem)

        if ($mustDisplayMeridiem && state.selectedDate) {
            setAm(state.selectedDate.hour < 12 ? true : false)
        }
    }, [state.selectedDate, state.format, state.multiple])

    if (state.multiple || state.range) return null

    return (state.timePicker || state.onlyTimePicker ?
        <div className={`rmdp-time-picker ${state.onlyTimePicker ? "rmdp-only-time-picker" : ""}`}>
            <div>
                <Arrow direction="rmdp-up" onClick={() => changeValue("hours", 1)} />
                <Input value={getHours()} onChange={handleChange} name="hours" local={state.local} />
                <Arrow direction="rmdp-down" onClick={() => changeValue("hours", -1)} />
            </div>
            <span className="dvdr">:</span>
            <div>
                <Arrow direction="rmdp-up" onClick={() => changeValue("minutes", 1)} />
                <Input value={getMinutes()} onChange={handleChange} name="minutes" local={state.local} />
                <Arrow direction="rmdp-down" onClick={() => changeValue("minutes", -1)} />
            </div>
            <span className="dvdr">:</span>
            <div>
                <Arrow direction="rmdp-up" onClick={() => changeValue("seconds", 1)} />
                <Input value={getSeconds()} onChange={handleChange} name="seconds" local={state.local} />
                <Arrow direction="rmdp-down" onClick={() => changeValue("seconds", -1)} />
            </div>
            <div style={getStyle()}>
                <Arrow direction="rmdp-up" onClick={toggleMeridiem} />
                <div className="rmdp-am">{am ? meridiems[0].shortName.toUpperCase() : meridiems[1].shortName.toUpperCase()}</div>
                <Arrow direction="rmdp-down" onClick={toggleMeridiem} />
            </div>
        </div>
        :
        null
    )

    function handleChange(value, name) {
        let { selectedDate } = state

        switch (name) {
            case "hours":
                selectedDate.hour = value
                break
            case "minutes":
                selectedDate.minute = value
                break
            default:
                selectedDate.second = value
                break
        }

        setDate(selectedDate)
    }

    function changeValue(type, value) {
        value = Number(value)
        let { selectedDate } = state

        switch (type) {
            case "hours":
                selectedDate.hour += value
                break
            case "minutes":
                selectedDate.minute += value
                break
            default:
                selectedDate.second += value
                break
        }

        setDate(selectedDate)
    }

    function setDate(selectedDate) {
        setState({
            ...state,
            selectedDate,
            date: new DateObject(selectedDate)
        })

        if (onChange instanceof Function) onChange(selectedDate)
    }

    function toggleMeridiem() {
        let { selectedDate } = state

        if (am && selectedDate.hour < 12) selectedDate.hour += 12
        if (!am && selectedDate.hour > 12) selectedDate.hour -= 12

        setDate(selectedDate)
        setAm(!am)
    }

    function getHours() {
        let hours = ""

        if (state.selectedDate) {
            if (!state.selectedDate.hour) state.selectedDate.hour = 0

            hours = mustDisplayMeridiem ? state.selectedDate.format("hh") : state.selectedDate.format("HH")
        }

        return hours
    }

    function getMinutes() {
        if (!state.selectedDate.minute) state.selectedDate.minute = 0

        return state.selectedDate ? state.selectedDate.format("mm") : ""
    }

    function getSeconds() {
        if (!state.selectedDate.second) state.selectedDate.second = 0

        return state.selectedDate ? state.selectedDate.format("ss") : ""
    }

    function getStyle() {
        return {
            display: mustDisplayMeridiem ? "flex" : "none"
        }
    }
}