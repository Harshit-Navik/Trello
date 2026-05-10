import { List } from "../models/list.model.js"

export const fetchList = async (listId) => {
    return List.findById(listId).lean();
}