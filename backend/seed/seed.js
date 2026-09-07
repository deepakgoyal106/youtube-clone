import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Create demo user only if it doesn't already exist
        let user = await User.findOne({
            email: "demo@youtubeclone.com"
        });

        if (!user) {
            const hashedPassword = await bcrypt.hash(
                "Demo@12345",
                10
            );

            user = await User.create({
                username: "DemoUser",
                email: "demo@youtubeclone.com",
                password: hashedPassword
            });

            console.log("Demo user created");
        } else {
            console.log("Demo user already exists");
        }

        // Create demo channel only if it doesn't already exist
        let channel = await Channel.findOne({
            name: "Demo Tech Channel",
            owner: user._id
        });

        if (!channel) {
            channel = await Channel.create({
                name: "Demo Tech Channel",
                description:
                    "A demo channel for the YouTube Clone MERN project.",
                owner: user._id
            });

            console.log("Demo channel created");
        } else {
            console.log("Demo channel already exists");
        }

        // Create demo videos only if they don't already exist
        const existingVideos = await Video.countDocuments({
            channel: channel._id
        });

        if (existingVideos === 0) {
            await Video.insertMany([
                {
                    title: "Introduction to MERN Stack",
                    category: "Coding",
                    description:
                        "Learn the basics of MongoDB, Express, React and Node.js.",
                    videoUrl:
                        "https://www.w3schools.com/html/mov_bbb.mp4",
                    thumbnailUrl:
                        "https://placehold.co/640x360?text=MERN+Stack",
                    channel: channel._id,
                    uploader: user._id,
                    views: 120,
                    likes: 15,
                    dislikes: 2
                },
                {
                    title: "JavaScript Basics",
                    category: "Education",
                    description:
                        "A beginner-friendly introduction to JavaScript.",
                    videoUrl:
                        "https://www.w3schools.com/html/mov_bbb.mp4",
                    thumbnailUrl:
                        "https://placehold.co/640x360?text=JavaScript",
                    channel: channel._id,
                    uploader: user._id,
                    views: 250,
                    likes: 25,
                    dislikes: 3
                },
                {
                    title: "Web Development Tips",
                    category: "Technology",
                    description:
                        "Useful tips for becoming a better web developer.",
                    videoUrl:
                        "https://www.w3schools.com/html/mov_bbb.mp4",
                    thumbnailUrl:
                        "https://placehold.co/640x360?text=Web+Development",
                    channel: channel._id,
                    uploader: user._id,
                    views: 340,
                    likes: 40,
                    dislikes: 4
                }
            ]);

            console.log("Demo videos created");
        } else {
            console.log("Demo videos already exist");
        }

        // Create demo comment only if it doesn't already exist
        const demoVideo = await Video.findOne({
            channel: channel._id
        });

        if (demoVideo) {
            const existingComment = await Comment.findOne({
                video: demoVideo._id,
                user: user._id
            });

            if (!existingComment) {
                await Comment.create({
                    text: "Great demo video!",
                    video: demoVideo._id,
                    user: user._id
                });

                console.log("Demo comment created");
            } else {
                console.log("Demo comment already exists");
            }
        }

        console.log("Database seed completed successfully");

        await mongoose.disconnect();

    } catch (error) {
        console.log(
            "Seed failed:",
            error.message
        );

        await mongoose.disconnect();

        process.exit(1);
    }
};

seedDatabase();