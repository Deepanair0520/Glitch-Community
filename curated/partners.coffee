# partner project pages
facebook = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FfacebookThumb.png?1492531632789"
microsoft = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FmicrosoftLogo.png?1493296051489"
twilio = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ftwilio.png?1493735308539"
wistia = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fwistia.png?1493735308565"
google = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FgoogleLogo.png?1494335487109"
slack = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fslack.svg?1494344404198"
signal = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fsignal.svg?1494371350294"
botkit = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FbotkitLogo.png?1495145720251"
trello = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ftrello.svg?1496329579103"
botwiki = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fbotwiki.svg?1497621318530"
twitter = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FtwitterLogo.svg?1498598490912"

backgroundOpacity = 0.3

# note: a project object's curatedName is the file name within the ./curated/partners directory where
# the partners' projects exist. if you change the curatedName the file name must also change and vice versa

module.exports = 
  [
      name: 'Facebook'
      url: 'facebook'
      curatedName: 'facebook'
      img: facebook
      color: '#70a4d8'
      description: "Kickstart creation of your own apps using Facebook developer APIs."
      background: "rgba(112, 164, 216, #{backgroundOpacity})"
    ,
      name: 'Microsoft'
      url: 'microsoft'
      curatedName: 'microsoft'
      img: microsoft
      color: '#70a4d8'
      description: "Leverage Microsoft APIs, SDKs and open source projects to make your own apps."
      background: "rgba(112, 164, 216, #{backgroundOpacity})"
    ,
      name: 'Twilio'
      url: 'twilio'
      curatedName: 'twilio'
      img: twilio
      color: 'rgb(255, 120, 100)'
      description: "Build apps that communicate with everyone in the world using Twilio's Voice & Video, Messaging, and Auth APIs."
      background: "rgba(255, 120, 100, #{backgroundOpacity})"
    ,
      name: 'Wistia'
      url: 'wistia'
      curatedName: 'wistia'
      img: wistia
      color: '#70a4d8'
      description: "Wistia's APIs allow you to easily upload, embed, and track videos within your own apps."
      background: "rgba(112, 164, 216, #{backgroundOpacity})"
    ,
      name: 'Google'
      url: 'google'
      curatedName: 'google'
      img: google
      color: "rgb(48, 220, 166)"
      description: "Get started with your own apps building on Google developer APIs."
      background: "rgba(48, 220, 166, #{backgroundOpacity})"  
    ,
      name: 'Slack'
      url: 'slack'
      curatedName: 'slack'
      img: slack
      color: "#FCF3AF"
      description: "Build bots, slash commands and apps for Slack."
      background: "rgba(252, 243, 174, #{backgroundOpacity})" 
    ,
      name: 'Slack Blueprints'
      url: 'slack-blueprints'
      curatedName: 'slack-blueprints'
      img: slack
      color: "#FCF3AF"
      description: "Project blueprints to kickstart building integrations for Slack."
      background: "rgba(252, 243, 174, #{backgroundOpacity})"     
    ,
      name: 'SIGNAL.2017'
      url: 'signal'
      curatedName: 'signal'
      img: signal
      color: "#ffe000"
      description: "The Developer Conference by Twilio."
      background: "rgba(0,0,0, #{backgroundOpacity})" 
    ,
      name: 'Botkit'
      url: 'botkit'
      curatedName: 'botkit'
      img: botkit
      color: "#C9BFF4"
      description: "Building blocks for building bots."
      background: "rgba(201, 191, 244, #{backgroundOpacity})"  
    ,
      name: 'Trello'
      url: 'trello'
      curatedName: 'trello'
      img: trello
      color: '#70a4d8'
      description: "Start building with Trello. Create your own power-ups and apps using Trello APIs."
      background: "rgba(112, 164, 216, #{backgroundOpacity})" 
    ,
      name: 'Botwiki'
      url: 'botwiki'
      curatedName: 'botwiki'
      img: botwiki
      color: "#F7E967"
      description: "Make friendly, useful, and artistic online bots."
      background: "rgba(0,0,0, #{backgroundOpacity})" 
    ,
      name: 'Twitter'
      url: 'twitter'
      curatedName: 'twitter'
      img: twitter
      color: '#70a4d8'
      description: "Tap into the Twitter Platform and build apps using Twitter APIs."
      background: "rgba(112, 164, 216, #{backgroundOpacity})"     
  ]