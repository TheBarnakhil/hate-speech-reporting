
type props = {
    onOptionSelect : (option:number, message:string) => void;
}

export const HomePrompts = ({onOptionSelect} : props) => {
    return(
        <div className="grid grid-cols-2 w-full h-full gap-[2rem]">
            <button className="btn btn-neutral rounded-lg min-h-[5rem]" onClick={() => onOptionSelect(1 ,"Mindfulness and breathing exercises")}>Mindfulness and breathing exercises</button>
            <button className="btn btn-neutral rounded-lg min-h-[5rem]" onClick={() => onOptionSelect(2 ,"Read inspiring quotes from social justice warriors.")}>Read inspiring quotes from social justice warriors.</button>
            <button className="btn btn-neutral rounded-lg min-h-[5rem]" onClick={() => onOptionSelect(3 ,"Take a look at some organisations you can reach out to for mental health support.")}>Take a look at some organisations you can reach out to for mental health support.</button>
            <button className="btn btn-neutral rounded-lg min-h-[5rem]" onClick={() => onOptionSelect(4 ,"No thanks, I just want to continue with reporting")}>No thanks, I just want to continue with reporting</button>
        </div>
    )
}