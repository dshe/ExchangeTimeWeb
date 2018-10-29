//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API

export function talk()
{
  // Google Web Speech API
  var msg = new SpeechSynthesisUtterance('hi');
  window.speechSynthesis.speak(msg);  
}
