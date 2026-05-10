import { List } from "../models/list.model.js"
import { ApiError } from "../utils/ApiError.js";

export const fetchList = async (listId) => {
    const list = await List.findById(listId).lean();
    if(!list) throw new ApiError(404, "list doesn't exists");

    return list;
}