import userListService from "../../services/auth/userList.service.js";

export default async function userListController(req, res, next) {
  try {
    const resService = await userListService();

    if (resService.status) {
      return res.status(200).json({
        status: true,
        message: "success get user list",
        data: resService.list,
      });
    }
  } catch (error) {
    next(error);
    // return res
    //   .status(500)
    //   .json({ status: false, message: "invalid server error", error: error });
  }
}
