/* 

This is a function to extract image urls from html text.
Author: Abdelmajid Abdellatif

*/

//Set lib object
const lib = {};

//A function to grab image urls from a html text
lib.getImageUrls = html => {
    //Set regex expression
    const regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
    //Set urls array
    const urls = [];
    //If there is match, push the url to urls array
    let m;
    while( m = regex.exec(html)){
        urls.push(m[0]);
    }
    //return urls array
    return urls;
};

//Export lib
module.exports = lib;