import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const DefaultQueryFn = async({queryKey}: any) => {
    const data = await axios.get(`https://jsonplaceholder.typicode.com${queryKey}`)
    return data
}

const DefaultQuery = () => {
  const {data,isLoading,isError} = useQuery({
    queryKey:['/todos'],
    queryFn: DefaultQueryFn
  })
  console.log('defaultquery',data)
  return (
    <>
      <div>
        <h1>TanStackQuery default query function</h1>
      </div>
    </>
  );
};

export default DefaultQuery;
