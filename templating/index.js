const fs = require('fs');
var showdown  = require('showdown')
const ejs = require('ejs');
const request = require('sync-request');

converter = new showdown.Converter()
const path = require('path');
const CONTENT = "../content"
const header_options = {
    headers: {
        'User-Agent': 'comeyrd/homepage'
    }
};
function copy(fin){
    const sourcePath = path.join(__dirname, CONTENT, fin); // Assuming the profile.png is in a directory named CONTENT
    const destinationPath = path.join(__dirname, '../output/', fin); // Assuming you want to copy it to the parent directory
    fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
            console.error('Error copying file:', err);
            return;
        }
    });
}

function rf(file){
    return fs.readFileSync(CONTENT +'/'+ file, 'utf8');
}

function getAbout(url) {
    try {
        
        // Make a GET request to the website
        const response = request('GET', 'https://api.github.com/repos/'+url,header_options);

        // Check the response status code
        if (response.statusCode === 200) {
            return JSON.parse(response.getBody('utf8'))["description"];
        } else {
            console.error('Failed to retrieve Markdown data. Status code:', response.statusCode);
            console.log(response.getBody('utf8'));
        }
    } catch (error) {
        console.error('Error retrieving Markdown data:', error.message);
    }
}

function getReadme(url) {
    try {
        const response = request('GET', 'https://raw.githubusercontent.com/'+url+'/main/README.md',header_options);

        if (response.statusCode === 200) {
            return response.getBody('utf8');
        } else {
            console.error('Failed to retrieve Markdown data. Status code:', response.statusCode);
        }
    } catch (error) {
        console.error('Error retrieving Markdown data:', error.message);
    }
}




// Parse Markdown to HTML
const profileContent = converter.makeHtml(rf("profile.md"));
const headerContent = "<a class='nav-link' href='./index.html'>Home</a><br>" + converter.makeHtml(rf("header.md"));
const projectsContent = converter.makeHtml(rf("projects.md"));
const projectsData = JSON.parse(rf("projects.json"));

let projectsArray = [];
projectsData.forEach(project => {
    let newobj={};
    newobj['Title'] = project.Title;
    newobj['about'] = converter.makeHtml("### ["+project.Title +"](./"+project.url+".html)\n\n" + getAbout(project.base+"/"+project.url));
    newobj['readme'] = converter.makeHtml(getReadme(project.base+"/"+project.url));
    newobj['header']="<a class='nav-link' href='./index.html'>Home</a> / <a href='#' class='nav-link'>"+project.Title+"</a><br>";
    const template = fs.readFileSync('index.ejs', 'utf8');
    newobj['git-link']="<a href='https://www.github.com/"+project.base+"/"+project.url+"' class='github-link' >Source Code on GitHub</a>";
    const html = ejs.render(template, { profileContent: profileContent, headerContent:newobj['header'] ,projectsContent: newobj['readme'],projectsArray:[],footerContent:newobj['git-link']});
    fs.writeFileSync('../output/'+project.url+".html", html);
    projectsArray.push(newobj);
});

// Render HTML using EJS template
const template = fs.readFileSync('index.ejs', 'utf8');
const html = ejs.render(template, { profileContent: profileContent, headerContent: headerContent ,projectsContent:projectsContent,projectsArray:projectsArray,footerContent:""});
fs.writeFileSync('../output/index.html', html);

projectsArray.forEach(project=>{
    
})
projectsData.forEach(project => {
    

});


copy("style.css");
copy("profile.png");
copy("robots.txt");