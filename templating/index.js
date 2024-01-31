const fs = require('fs');
var showdown  = require('showdown')
const ejs = require('ejs');
converter = new showdown.Converter()
const path = require('path');

function copy(fin){
    const sourcePath = path.join(__dirname, CONTENT, fin); // Assuming the profile.png is in a directory named CONTENT
    const destinationPath = path.join(__dirname, '../output/', fin); // Assuming you want to copy it to the parent directory
    fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
            console.error('Error copying file:', err);
            return;
        }
        console.log('File copied successfully!');
    });
}
const CONTENT = "../content"
// Read the Markdown files
const profileMarkdown = fs.readFileSync(CONTENT + '/profile.md', 'utf8');
const contentMarkdown = fs.readFileSync(CONTENT + '/content.md', 'utf8');


// Parse Markdown to HTML
const profileContent = converter.makeHtml(profileMarkdown);
const contentContent = converter.makeHtml(contentMarkdown);

// Render HTML using EJS template
const template = fs.readFileSync('template.ejs', 'utf8');
const html = ejs.render(template, { profileContent: profileContent, contentContent: contentContent });

// Write the HTML to a file
fs.writeFileSync('../output/index.html', html);

copy("style.css");
copy("profile.png");