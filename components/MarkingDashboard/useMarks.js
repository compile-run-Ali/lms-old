import useMarksHook from "./marksHook";

const useMarksList = () => {
    const [marksList, setMarksList] = useMarksHook();

}

export default useMarksList;