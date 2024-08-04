const AlertEnum = {
  INFO: 'Info',
  WARNING: 'Warning',
  SEVERE: 'Severe', 
};

const iconsMap = {
  [AlertEnum.INFO]: {
    icon:'information',
    color: 'blue',
  },
  [AlertEnum.WARNING]: {
    icon: 'alert',
    color: 'orange',
  },
  [AlertEnum.SEVERE]: {
    icon: 'alert-octagon',
    color: 'red',
  },
};

export default AlertEnum;

export { iconsMap };
