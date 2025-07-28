const puppeteer = require('puppeteer');

async function testAddComment() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Login first
    await page.goto('http://localhost:8080/login');
    console.log('Logging in...');
    
    // Fill in login form
    await page.type('input[name="username"]', 'testuser');
    await page.type('input[name="password"]', 'password');
    
    // Submit the form
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation()
    ]);
    
    // 2. Go to the post page
    await page.goto('http://localhost:8080/post/6887c451fc007f50b1a3e0cb');
    console.log('On post page...');
    
    // 3. Fill out the comment form
    await page.type('input[name="name"]', 'Automated Test User');
    await page.type('textarea[name="message"]', 'This is an automated test comment');
    
    // Make sure the postId is correctly set
    const postId = await page.$eval('input[name="postId"]', el => el.value);
    console.log('Post ID from form:', postId);
    
    // 4. Submit the comment form
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation()
    ]);
    
    console.log('Comment submitted!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Uncomment to run the test
// testAddComment();

// We won't actually run this, but this is how you would test it with a real browser
