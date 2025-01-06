import type { CustomFlowbiteTheme } from 'flowbite-react';

const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    root: {
      color: {
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300',
        primary:
          'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300',
      },
      size: {
        xl: 'px-3 py-2 text-base rounded-md',
      },
    },
    icon: {
      off: 'rounded-[6px] px-2 py-1',
    },
  },
  button: {
    color: {
      gray: 'text-[#6B7280] bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 :ring-gray-700 focus:text-gray-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 focus:ring-2',
      info: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
      primary:
        'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
    },
    inner: {
      base: 'flex items-center transition-all duration-200 max-md:px-2',
    },
    outline: {
      color: {
        gray: 'border border-gray-200 dark:border-gray-500',
      },
    },
  },
  dropdown: {
    floating: {
      base: 'z-10 w-fit rounded-xl divide-y divide-gray-100 shadow overflow-hidden',
      content: 'rounded-xl text-sm text-gray-700 dark:text-gray-200',
      target: 'w-fit dark:text-white',
      item: {
        base: 'text-start flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white',
      },
    },
    content: '',
  },
  modal: {
    content: {
      base: 'relative max-sm:h-full w-full p-4 h-auto',
      inner:
        'relative rounded-lg bg-white shadow dark:bg-gray-800 max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:fixed max-sm:rounded-b-none max-sm:rounded-t-2xl',
    },
    body: {
      base: 'p-5 flex-1 overflow-y-auto max-h-[70vh] max-sm:px-3 max-sm:py-4',
    },
    header: {
      base: 'flex items-start justify-between rounded-t max-sm:px-3 px-5 pt-5 border-b pb-3 hide-close-btn-modal',
      title:
        'max-sm:text-[20px] text-[22px] text-gray-900 dark:text-white font-bold w-full',
    },
    footer: {
      base: 'flex items-center rounded-b border-gray-200 max-sm:px-4 max-sm:py-4 p-6 dark:border-gray-600 foobar-modal-custom gap-3',
    },
  },
  navbar: {
    root: {
      base: 'fixed z-[10] w-full bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    },
  },
  sidebar: {
    root: {
      base: 'flex fixed top-0 left-0 z-[9] flex-col flex-shrink-0 h-full duration-75 border-r border-gray-200 lg:flex transition-width dark:border-gray-700',
    },
    item: {
      base: 'flex items-center justify-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
    },
    collapse: {
      button:
        'group flex w-full items-center rounded-lg p-2 text-base font-medium text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700',
    },
  },
  card: {
    root: {
      children:
        'flex h-full flex-col justify-center gap-3 p-6 max-sm:px-3 max-sm:py-4 card-inner',
    },
  },
  textarea: {
    base: 'block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50',
  },
  textInput: {
    field: {
      input: {
        colors: {
          info: 'border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-700 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-400 dark:bg-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-500',
        },
        withIcon: {
          on: '!pl-10',
        },
      },
    },
  },
  toggleSwitch: {
    toggle: {
      checked: {
        color: {
          blue: 'bg-blue-700 border-blue-700',
        },
      },
    },
  },
  pagination: {
    pages: {
      previous: {
        base: 'ml-0 rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        icon: 'h-5 w-5',
      },
      next: {
        base: 'rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        icon: 'h-5 w-5',
      },
      selector: {
        base: 'w-10 border font-semibold border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white',
        active: '!bg-primary-100 !text-primary-600',
        disabled: 'opacity-50 cursor-normal',
      },
    },
  },
};

export default flowbiteTheme;
