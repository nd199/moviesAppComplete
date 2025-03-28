import Check from './animations/Check.json';
import SLoad from './animations/SLoad.json';


export const CheckOption = {
    loop: true,
    autoplay: true,
    animationData: Check,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

export const ServerConnectingOptions = {
  loop: true,
  autoplay: true,
  animationData: SLoad,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};