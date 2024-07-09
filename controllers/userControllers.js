import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";
import Video from "../models/Video";
import { fileRemover } from "../utils/fileRemover";
import jwt from 'jsonwebtoken';

// Utility function for sending error responses
const sendErrorResponse = (error, res, next) => {
  res.status(error.statusCode || 500).json({ message: error.message });
  next(error);
};

// Utility function for generating user response data
const generateUserResponseData = (user, token) => ({
  _id: user._id,
  avatar: user.avatar,
  name: user.name,
  email: user.email,
  verified: user.verified,
  admin: user.admin,
  editor: user.editor,
  score: user.score,
  subscriber: user.subscriber,
  subscribedUsers: user.subscribedUsers,
  level: user.level,
  status: user.status,
  token,
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, status } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      let error = new Error("User already registered");
      error.statusCode = 400;
      throw error;
    }

    user = new User({ name, email, password, status });
    await user.save();

    const token = await user.generateJWT();

    res.status(201).json(generateUserResponseData(user, token));
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      let error = new Error("Email not found");
      error.statusCode = 404;
      throw error;
    }

    if (await user.comparePassword(password)) {
      const token = await user.generateJWT();
      res.status(200).json(generateUserResponseData(user, token));
    } else {
      let error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(generateUserResponseData(user));
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.userId;
    const userId = req.user._id;

    if (!req.user.admin && userId !== userIdToUpdate) {
      let error = new Error("Forbidden resource");
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findById(userIdToUpdate);

    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (req.user.admin && typeof req.body.admin !== "undefined") {
      user.admin = req.body.admin;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        let error = new Error("Password length must be at least 6 characters");
        error.statusCode = 400;
        throw error;
      }
      user.password = req.body.password;
    }

    const updatedUserProfile = await user.save();
    const token = await updatedUserProfile.generateJWT();

    res.status(200).json(generateUserResponseData(updatedUserProfile, token));
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        let error = new Error("An unknown error occurred when uploading: " + err.message);
        error.statusCode = 500;
        throw error;
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        let error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const oldFilename = user.avatar;

      if (req.file) {
        user.avatar = req.file.filename;
      } else {
        user.avatar = "";
      }

      await user.save();
      if (oldFilename) {
        fileRemover(oldFilename);
      }

      const token = await user.generateJWT();
      res.status(200).json(generateUserResponseData(user, token));
    });
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword || "";
    const where = filter ? { email: { $regex: filter, $options: "i" } } : {};

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await User.countDocuments(where);
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": total.toString(),
      "x-currentpage": page.toString(),
      "x-pagesize": pageSize.toString(),
      "x-totalpagecount": pages.toString(),
    });

    if (page > pages) {
      return res.json([]);
    }

    const users = await User.find(where).skip(skip).limit(pageSize).sort({ updatedAt: "desc" });

    res.status(200).json(users);
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const posts = await Post.find({ user: user._id });
    const postIds = posts.map(post => post._id);

    await Comment.deleteMany({ post: { $in: postIds } });
    await Post.deleteMany({ _id: { $in: postIds } });
    posts.forEach(post => fileRemover(post.photo));
    fileRemover(user.avatar);

    await user.remove();

    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfull.")
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      res.status(200).json("Unsubscription successfull.")
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { likes: req.user.id },
      $pull: { dislikes: req.user.id },
    });

    res.status(200).json("The video has been liked.");
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const dislike = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { dislikes: req.user.id },
      $pull: { likes: req.user.id },
    });

    res.status(200).json("The video has been disliked.");
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({ ...req.body, fromGoogle: true });
      const savedUser = await newUser.save();

      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (error) {
    sendErrorResponse(error, res, next);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


