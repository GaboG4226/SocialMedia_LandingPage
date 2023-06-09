import User from "../models/User.js";

/* Read */ 
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

/* Update */
export const addRemoveFriend = async (req, res) => {
    try {
        console.log(req)
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        console.log(user)
        console.log(friend)
        
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save()
        await friend.save();

        const friends = await Promise.all( // promise array to handle asynchronous operations
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map( // formatting for the front end to read the information and send only necessaty data
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        );

        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(404).json({message: err.message});
    }
}