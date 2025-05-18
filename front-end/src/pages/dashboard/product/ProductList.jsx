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
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import useDebounce from "../../../hooks/useDebounce";
import { deleteRequest, getRequest } from "../../../utils/apiHandler";
import { formatImageUrl } from "../../../utils/index";
import PaginationButtons from "../../../components/shared/PaginationButtons";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

const ProductsList = () => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchTextValue = useDebounce(searchText, 1000);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [debouncedSearchTextValue, "Products", searchParams.get("page")],
    queryFn: async ({ queryKey }) => {
      const [keyword] = queryKey;
      const res = await getRequest({
        endpoint: `/products?keyword=${keyword}&page=${searchParams.get(
          "page",
        )}`,
      });
      return res?.data;
    },
  });

  const navigate = useNavigate();

  const deleteProduct = async (id) => {
    try {
      const res = await deleteRequest({
        endpoint: `/products/${id}`,
      });

      if (res.ok) {
        toast.success(res.message);
        refetch();
        return;
      }

      toast.error("Unexpected Error Occurred. Please try again later");
    } catch (e) {
      toast.error("Unexpected Error Occurred. Please try again later");
    }
  };

  const TABLE_HEAD = [
    "Product",
    "Category",
    "Price",
    "Stock",
    "Added On",
    "Actions",
  ];

  if (isLoading) return <div>Fetching Products...</div>;

  return (
    <div className="bg-white p-6 rounded-lg px-2 md:px-5 py-5 md:pt-3">
      <div className="flex flex-col md:flex-row gap-y-4 justify-between items-center">
        <div className="text-xl">Products</div>

        <div className="flex flex-col md:flex-row gap-y-4 gap-x-4">
          <div className="w-72">
            <Input
              label="Search Product"
              icon={<FaSearch />}
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>

          <div>
            <Link to="add">
              <Button>Add</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10">
        {response?.products?.length === 0 && <Alert>No Products Found</Alert>}

        {response?.products?.length > 0 && (
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
                {response?.products.map((product, index) => {
                  const {
                    _id,
                    name,
                    basePrice,
                    category,
                    stock,
                    createdAt,
                    images,
                  } = product;

                  const isLast = index === response?.products.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={uuid()}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={formatImageUrl(images?.[0])}
                            alt={name}
                            size="sm"
                            className="!rounded"
                          />
                          <Typography variant="small" className="font-normal">
                            {name}
                          </Typography>
                        </div>
                      </td>

                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {category}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          NPR {basePrice}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {stock}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography variant="small" className="font-normal">
                          {format(new Date(createdAt), "MMMM d, yyyy")}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="blue"
                            className="p-2"
                            onClick={() => {
                              navigate(`edit/${_id}`);
                            }}
                          >
                            <FaEdit className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            color="red"
                            className="p-2"
                            onClick={() => {
                              deleteProduct(_id);
                            }}
                          >
                            <FaTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <PaginationButtons
              hasNextPage={response?.pagination.hasNextPage}
              hasPrevPage={response?.pagination.hasPrevPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
