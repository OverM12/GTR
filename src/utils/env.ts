export const getBaseLogoutUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL_LOGOUT_POR;
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL_LOGOUT;
  }
};

export const getBaseNewlogUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL_NEWLOG_POR;
  } else {
    return process.env.NEXT_PUBLIC_BASE_URL_NEWLOG;
  }
};
