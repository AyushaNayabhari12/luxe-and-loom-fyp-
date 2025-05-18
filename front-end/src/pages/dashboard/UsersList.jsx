import {
  Alert,
  Avatar,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import useDebounce from "../../hooks/useDebounce";
import { deleteRequest, getRequest } from "../../utils/apiHandler";
import { formatImageUrl } from "../../utils";
import { toast } from "sonner";

const UsersList = () => {
  const [searchText, setSearchText] = useState("");

  const debouncedSearchTextValue = useDebounce(searchText, 1000);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [debouncedSearchTextValue, "Users"],
    queryFn: async ({ queryKey }) => {
      try {
        const [_searchText, _role] = queryKey;

        const queryString = `search=${_searchText}`;

        const res = await getRequest({
          endpoint: `/users?${queryString}`,
        });

        return res?.data || [];
      } catch (error) {
        return [];
      }
    },
  });

  const deleteUser = async (id) => {
    try {
      const res = await deleteRequest({
        endpoint: `/users/${id}`,
      });

      if (res.ok) {
        refetch();
        toast.success(res.message);
        return;
      }

      toast.error("Unexpected Error Occurred. Please try again later");
    } catch (e) {
      toast.error("Unexpected Error Occurred. Please try again later");
    }
  };

  const TABLE_HEAD = [
    "User",
    "Addresses",
    "Phone Number",
    "Registered Date",
    "Actions",
  ];

  const TABLE_ROWS = users || [];

  if (isLoading) {
    return <div>Fetching Data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg px-2 md:px-5 py-5 md:pt-3">
      <div className="flex flex-col md:flex-row gap-y-4 justify-between items-center">
        <div className="text-xl">Users</div>

        <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
          <div className="w-72">
            <Input
              label="Search User"
              icon={<FaSearch />}
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        {TABLE_ROWS.length === 0 && <Alert>No Users Found</Alert>}

        {TABLE_ROWS.length !== 0 && (
          <>
            <div className="px-0">
              <table className="w-full table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={uuid()}
                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {TABLE_ROWS.map((user, index) => {
                    const {
                      _id,
                      name,
                      email,
                      address,
                      createdAt,
                      phoneNum,
                      profileImage,
                    } = user;

                    const isLast = index === TABLE_ROWS.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={uuid()}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={formatImageUrl(profileImage)}
                              alt={name}
                              size="sm"
                            />

                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {name}
                              </Typography>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-70"
                              >
                                {email}
                              </Typography>
                            </div>
                          </div>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {address}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {phoneNum}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {format(new Date(createdAt), "MMMM d, yyyy")}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <Button
                              size="sm"
                              color="red"
                              className="p-2"
                              onClick={() => {
                                deleteUser(_id);
                              }}
                            >
                              <FaTrash className="w-4 h-4" />
                            </Button>
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersList;
