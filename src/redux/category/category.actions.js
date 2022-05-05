import { CategoryActionTypes } from "./category.types"

export const setCategories = categories => ({
    type: CategoryActionTypes.SET_CATEGORIES,
    payload: categories
})

export const setCategory = (category) => ({
    type: CategoryActionTypes.SET_CATEGORY,
    payload: category
})