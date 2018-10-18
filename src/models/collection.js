/* global CDN_URL EDITOR_URL*/

export const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";

export const colors = {pink: "#FFA3BB", orange: "#FBA058", yellow: "#FCF3AF", green:"#30DCA6", cyan: "#67BEFF", blue: "#70A4D8", purple: "#C9BFF4" };

export const avatars = {
  computer: "https://cdn.hyperdev.com/us-east-1%3Acba180f4-ee65-4dfc-8dd5-f143280d3c10%2Fcomputer.svg",
  tetris: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Ftetris.svg",
  robot: "https://cdn.hyperdev.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Frobot.svg",
  hardware: "https://cdn.gomix.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fhardware.svg",
  art: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fart.svg?1499357014248",
  music: "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fmusic.svg?1502555440002",
};

export const defaultAvatar = "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1539891965867";

export const getContrastTextColor = (hexcolor) =>{
    // remove #
    hexcolor = hexcolor.substring(hexcolor.indexOf("#") +1);
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}


export const hexToRgbA = (hex) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.35)';
  }
  return false;
  console.log('bad hex');
  // throw new Error('Bad Hex');
};

export default function Collection({users, projects}) {
  const props = {
    // get teams() { return teams ? teams.map(team => Team(team).asProps()) : []; },
    get users() { return users ? users.map(user => User(user).asProps()) : []; },
    get projects() {return projects ? projects.map(project => Project(project).asProps()) : []; }
  };
  return {
    update: data => Collection(data),
    asProps: () => props,
  };
}

export function getAvatarUrl(id) {
  return `${CDN_URL}/collection-avatar/${id}.png`;
}

export function getLink(userName, url) {
  return `/@${userName}/${url}`;
}

// export function getShowUrl(domain) {
//   return `//${domain}.glitch.me`;
// }

// export function getEditorUrl(domain, path, line, character) {
//   if (path && !isNaN(line) && !isNaN(character)) {
//     return `${EDITOR_URL}#!/${domain}?path=${path}:${line}:${character}`;
//   }
//   return `${EDITOR_URL}#!/${domain}`;
// }

// export function getRemixUrl(domain) {
//   return `${EDITOR_URL}#!/remix/${domain}`;
// }

// Circular dependencies must go below module.exports
// import Team from './team';
import User from './user';
// eventually want to handle whether the collection belongs to a team or a user

import Project from './project';


export const defaultAvatarSVG = "<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="159px" height="147px" viewBox="0 0 159 147" version="1.1">
    <!-- Generator: Sketch 52.2 (67145) - http://www.bohemiancoding.com/sketch -->
    <title>collection-avatar</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <polygon id="path-1" points="0 0 159 0 159 132 0 132"/>
        <polygon id="path-3" points="0 0 124 0 124 102 0 102"/>
    </defs>
    <g id="collection-avatar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="picture-frame-copy">
            <polygon id="Fill-1" fill="#FAE7E5" points="0 147 159 147 159 15 0 15"/>
            <g id="Group-4" transform="translate(0.000000, 15.000000)">
                <mask id="mask-2" fill="white">
                    <use xlink:href="#path-1"/>
                </mask>
                <g id="Clip-3"/>
                <path d="M4.41666667,127.550562 L154.583333,127.550562 L154.583333,4.4494382 L4.41666667,4.4494382 L4.41666667,127.550562 Z M159,136.449438 L-3.55271368e-15,136.449438 C-2.43947222,136.449438 -4.41666667,134.457573 -4.41666667,132 L-4.41666667,4.4408921e-15 C-4.41666667,-2.45757303 -2.43947222,-4.4494382 -3.55271368e-15,-4.4494382 L159,-4.4494382 C161.439472,-4.4494382 163.416667,-2.45757303 163.416667,4.4408921e-15 L163.416667,132 C163.416667,134.457573 161.439472,136.449438 159,136.449438 Z" id="Fill-2" fill="#222222" mask="url(#mask-2)"/>
            </g>
            <g id="Group-9" transform="translate(63.000000, 0.000000)" fill="#222222">
                <path d="M5.39511061,14.06 L29.8773227,14.06 C28.7177318,8.99988 23.6693227,5.18 17.6362167,5.18 C11.6031106,5.18 6.55617121,8.99988 5.39511061,14.06 M32.3331864,18.5 L2.93924697,18.5 C1.72086818,18.5 0.734701515,17.50692 0.734701515,16.28 C0.734701515,7.7108 8.31686818,0.74 17.6362167,0.74 C26.9555652,0.74 34.5377318,7.7108 34.5377318,16.28 C34.5377318,17.50692 33.5515652,18.5 32.3331864,18.5" id="Fill-5"/>
                <polygon id="Fill-7" points="92.9008682 146.683984 73.3215652 130.551984 76.1139894 127.115424 95.6932924 143.247424"/>
            </g>
            <polygon id="background" fill="#70A4D8" points="17 132 141 132 141 30 17 30"/>
            <g id="Group-13" transform="translate(17.000000, 30.000000)">
                <mask id="mask-4" fill="white">
                    <use xlink:href="#path-3"/>
                </mask>
                <g id="Clip-12"/>
                <path d="M4.42857143,97.5652174 L119.571429,97.5652174 L119.571429,4.43478261 L4.42857143,4.43478261 L4.42857143,97.5652174 Z M124,106.434783 L-8.8817842e-14,106.434783 C-2.44604762,106.434783 -4.42857143,104.449478 -4.42857143,102 L-4.42857143,-2.48689958e-14 C-4.42857143,-2.44947826 -2.44604762,-4.43478261 -8.8817842e-14,-4.43478261 L124,-4.43478261 C126.446048,-4.43478261 128.428571,-2.44947826 128.428571,-2.48689958e-14 L128.428571,102 C128.428571,104.449478 126.446048,106.434783 124,106.434783 Z" id="Combined-Shape" fill="#222222" mask="url(#mask-4)"/>
                <path d="" id="Path-2" stroke="#979797" fill-rule="nonzero" mask="url(#mask-4)"/>
            </g>
            <g id="corners" transform="translate(0.000000, 16.000000)" fill="#222222">
                <polygon id="Fill-14" points="140.496387 18 138 14.8389049 155.503613 0 158 3.16109514"/>
                <polygon id="Fill-15" points="17.5036132 18 0 3.16109514 2.49638681 0 20 14.8389049"/>
                <polygon id="Fill-16" points="2.74602549 131 0 127.487672 19.2539745 111 22 114.512328"/>
            </g>
            <path d="M46.5902941,62.5755643 C43.7814706,61.2579393 41.1285294,60.0114571 36.7476471,59.2763143 C29.5255882,58.0624393 23.9005882,58.0402071 20.0270588,59.2125821 C18.8579412,59.5682964 17.6314706,58.8983679 17.2814706,57.7215464 C16.93,56.5462071 17.5917647,55.3056536 18.7594118,54.9543857 C23.3476471,53.5656179 29.4682353,53.5448679 37.4726471,54.8906536 C42.4461765,55.7251 45.6373529,57.2235464 48.4535294,58.5456179 C52.4079412,60.4012607 55.8329412,62.0093857 63.7314706,61.80485 C70.0094118,61.6462607 74.6535294,59.242225 80.0285294,56.4587607 C86.0461765,53.3432964 92.8667647,49.81135 103.013824,49.3252071 C120.462353,48.4892786 133.793235,38.3499393 136.407941,35.6791179 C137.262353,34.8046536 138.659412,34.7957607 139.527059,35.65985 C140.394706,36.5224571 140.403529,37.9290107 139.547647,38.803475 C136.022647,42.4021179 121.781471,52.8779036 103.224118,53.7671893 C94.0314706,54.2073857 87.9373529,57.3628679 82.0447059,60.4146 C76.4314706,63.3210821 71.13,66.0660107 63.8417647,66.2497964 C63.3726471,66.2616536 62.9152941,66.2675821 62.4726471,66.2675821 C54.4535294,66.2675821 50.4608824,64.3926714 46.5902941,62.5755643 Z" id="Fill-17" fill="#222222"/>
            <path d="M18.4860294,93.0764339 C17.3580882,92.6140054 16.8139706,91.3171304 17.2742647,90.1788446 C17.7330882,89.0405589 19.0169118,88.4951304 20.1477941,88.9560768 C30.9772059,93.3936125 43.3801471,94.5274518 57.0139706,92.3249875 C67.1066176,90.6946304 73.8919118,87.1463804 80.4551471,83.7137375 C87.3654412,80.1002732 94.5110294,76.3637911 105.174265,75.0180054 C123.374265,72.7221661 130.675735,68.8626661 136.006618,66.0436304 C136.513971,65.7768446 137.003676,65.5174696 137.484559,65.2684696 C138.568382,64.7097018 139.896324,65.1395232 140.453676,66.2333446 C141.009559,67.3256839 140.581618,68.6655411 139.497794,69.2257911 C139.028676,69.4673804 138.550735,69.7208268 138.056618,69.9816839 C132.427206,72.9578268 124.716912,77.0337196 105.724265,79.4288625 C95.8433824,80.6768268 89.3551471,84.0679696 82.4875,87.6606839 C75.6139706,91.2548804 68.5066176,94.9706125 57.7125,96.7150946 C52.9698529,97.4813625 48.3595588,97.8637554 43.8977941,97.8637554 C34.7742647,97.8637554 26.2683824,96.2645232 18.4860294,93.0764339 Z" id="Fill-19" fill="#222222"/>
            <path d="M45.7748529,117.611382 C36.3086765,117.611382 27.4601471,116.645025 19.3130882,114.710829 C18.1277941,114.430704 17.3925,113.233132 17.6719118,112.038525 C17.9498529,110.842436 19.1351471,110.101364 20.3233824,110.384454 C33.8866176,113.599221 49.5380882,114.029043 66.8425,111.660579 C83.2557353,109.412168 91.7410294,106.195918 99.9469118,103.086382 C104.827794,101.23815 109.874853,99.3247036 116.429265,97.6839714 C127.876324,94.8189893 135.041029,92.907025 137.724853,92.0029179 C138.885147,91.6145964 140.130735,92.243025 140.516029,93.4079893 C140.902794,94.5729536 140.279265,95.8312929 139.123382,96.2210964 C136.289559,97.1741143 129.214559,99.0653286 117.493971,101.998489 C111.186618,103.578454 106.482206,105.361471 101.499853,107.248239 C93.0645588,110.445221 84.3425,113.751882 67.4366176,116.066989 C59.9116176,117.097079 52.6792647,117.611382 45.7748529,117.611382" id="Fill-21" fill="#222222"/>
        </g>
        <path d="M21.2583002,56.7083628 C22.653122,56.3354048 25.1023597,56.1489258 28.6060136,56.1489258 C32.9153585,56.1489258 39.662577,57.2635831 45.8383789,59.6538086 C50.675477,61.5259145 55.6767051,63.4365756 59.8491211,63.706543 C62.7648503,63.8951991 67.3391594,64.3869139 74.972168,61.4775391 C80.6710725,59.3053616 87.3875338,54.8617207 93.7797852,52.9892578 C103.845153,50.0408399 121.380258,52.1505672 138.267578,36.5024414 C138.267579,35.5066675 138.26758,34.5108935 138.267581,33.5151196 L138.267582,33.5151196 C138.267582,32.9628348 137.819868,32.5151191 137.267583,32.5151186 C137.267583,32.5151186 137.267582,32.5151186 137.267582,32.5151186 L21,32.5151196 C20.4477153,32.5151196 20,32.9628348 20,33.5151196 L20.0000487,55.7423486 C20.0000487,56.2946064 20.4477422,56.7422999 21,56.7422999 C21.0872116,56.7422999 21.1740485,56.7308907 21.2583002,56.7083628 Z" id="top-enclosure" stroke="#222222" stroke-width="4" fill-opacity="0.7" fill="#FFFFFF" fill-rule="nonzero"/>
        <path d="M20,91.8880927 L20,111.60319 C24.0660968,113.239404 31.7710664,114.26881 43.1149089,114.691406 C47.6769106,114.861356 53.1243726,114.556978 59.6334635,114.041992 C65.2135614,113.600507 69.6201172,112.907878 77.2014974,111.60319 C77.4012943,111.568807 89.1244964,108.771992 93.6572266,106.875651 C99.6585286,104.364909 108.066518,101.708185 113.883464,100.042318 C126.957065,96.2982764 134.995911,94.2305232 138,93.8390581 L138,68.3424479 C135.916382,69.4971717 132.465319,71.0183306 127.64681,72.9059245 C123.425617,74.559527 116.843818,76.5916208 111.109701,77.1484375 C106.381263,77.6075968 97.1142099,79.1999706 93.6572266,80.6842448 C83.0384115,85.2434896 80.9141377,86.7468825 77.2014974,88.5745443 C70.6810133,91.7844538 63.4164916,94.1269071 58,95.4713542 C51.3778295,97.1150672 45.4649643,96.3639525 38.7747396,96.0865885 C33.1815638,95.8547062 26.9233172,94.4552076 20,91.8880927 Z" id="bottom-enclosure" stroke="#222222" stroke-width="3" fill-opacity="0.7" fill="#FFFFFF" fill-rule="nonzero"/>
    </g>
</svg>";