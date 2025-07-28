const mongoose = require('mongoose');
const Post = require('./models/post');
const Comment = require('./models/comment');

async function testComment() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/blogs', { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Connected to MongoDB');

    // Create new comment
    console.log('Creating test comment...');
    const newComment = new Comment({
      name: 'Final Test User',
      email: 'final@test.com',
      message: 'This is a final test comment'
    });
    const savedComment = await newComment.save();
    console.log('Comment saved:', savedComment._id);

    // Find post
    const post = await Post.findById('6887c451fc007f50b1a3e0cb');
    if (!post) {
      console.log('Post not found');
      return;
    }
    console.log('Post found:', post.title);

    // Add comment to post
    post.comments.push(savedComment._id);
    await post.save();
    console.log('Comment added to post');

    // Verify
    const updatedPost = await Post.findById('6887c451fc007f50b1a3e0cb');
    console.log('Updated post comments IDs:', updatedPost.comments);

    // Try populating
    const populatedPost = await Post.findById('6887c451fc007f50b1a3e0cb').populate('comments');
    console.log('Populated comments:', JSON.stringify(populatedPost.comments, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testComment();
