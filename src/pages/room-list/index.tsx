import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { createRoom } from "@modules/api/room";
import { useEffect, useId, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const CREATE_PARAM_KEY = "create";

function RoomListPage() {
  const [searchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(
    !!searchParams.get(CREATE_PARAM_KEY)
  );
  const nameId = useId();
  const imageId = useId();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [error, setError] = useState(false);

  useEffect(() => {
    // if (!image) setError(false);
  }, [image]);

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ image, name });
    await createRoom({ image, name });
    setName("");
    setImage("");
  };

  return (
    <div className="p-4 size-full">
      {isCreating ? (
        <>
          <div className="w-full gap-2 relative p-1">
            <Link
              to={""}
              className="hover:underline p-1 absolute left-0"
              onClick={() => setIsCreating(false)}
            >
              <ChevronLeftIcon className="size-5" />
            </Link>
            <div className="flex-1 text-center font-semibold">
              Create a new room
            </div>
          </div>
          <form className="max-w-72 mx-auto h-full" onSubmit={handleCreateRoom}>
            <label htmlFor={nameId} className="flex flex-col gap-2 mt-4">
              <p className="font-bold">Name</p>
              <input
                className="p-2 rounded-md py-1 border border-black"
                id={nameId}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
            <label htmlFor={imageId} className="flex flex-col gap-2 mt-4">
              <p className="font-bold">Image</p>
              <input
                className="p-2 rounded-md py-1 border border-black"
                id={imageId}
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </label>
            {image && (
              <img
                onError={() => {
                  // setError(true);
                }}
                src={image}
                className="w-full"
              />
            )}
            <div className="w-full flex items-center mt-6">
              <button className="p-2 bg-blue-600 rounded-md text-white mx-auto">
                Create Room
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="size-full flex justify-center items-center font-semibold text-xl">
          <Link
            to={`?${CREATE_PARAM_KEY}=true`}
            onClick={() => {
              setIsCreating(true);
            }}
          >
            Create a new room
          </Link>
        </div>
      )}
    </div>
  );
}

export default RoomListPage;
