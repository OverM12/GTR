export const getBaseLogoutUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL_LOGOUT_PRO;
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL_LOGOUT;
  }
};

export const getBaseNewlogUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL_NEWLOG_PRO;
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL_NEWLOG;
  }
};
