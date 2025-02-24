import OutsideClickHandler from 'react-outside-click-handler'
import {
  createElement as create,
  useContext,
  useState,
  useEffect,
  FC,
  ReactNode,
  ChangeEvent,
  useRef,
  useMemo,
} from 'react'
import { css } from 'emotion'
import { Theme } from './Theme'

export interface IInputs {
  Container: FC<{
    children: ReactNode
    enable?: boolean
  }>
  Icon: FC<{
    name?: string
  }>
  Control: FC<{
    label?: string
    description?: string
    value?: any
    change?: (data: any) => Promise<any>
    input: FC<{
      key: string
      change: (data: any) => void
      enable: (state: boolean) => void
    }>
  }>
  Pointer: FC<{
    children: ReactNode
    label: string
  }>
  Number: FC<{
    value?: number
    change?: (value: number) => void
    placeholder?: string | number
    decimals?: boolean
  }>
  Boolean: FC<{
    value?: boolean
    change?: (value: boolean) => void
    enable?: (value: boolean) => void
    label: string
    description: string
  }>
  String: FC<{
    value?: string
    change?: (value: string) => void
    placeholder?: string
    large?: boolean
    password?: boolean
  }>
  StringArray: FC<{
    value?: string[]
    change?: (value: string[]) => void
    placeholder?: string
  }>
  StringMulti: FC<{
    value?: string[]
    change?: (value?: string[]) => void
    options: Array<{
      value: string
      label: string
      description: string
    }>
  }>
  Select: FC<{
    value?: string
    change?: (value?: string) => void
    search?: (phrase: string) => void
    options?: Array<{
      value: string
      label: string
      description: string
    }>
  }>
  StripeCard: FC<{
    stripe: any
    change?: (card?: any) => void
    issue?: (card?: any) => void
  }>
  Files: FC<{
    change?: (files?: FileList) => void
    multiple?: boolean
  }>
}

export const Inputs: IInputs = {
  Container: ({ children, enable }) => {
    const theme = useContext(Theme)
    return create('div', {
      children,
      className: css({
        all: 'unset',
        display: 'flex',
        alignItems: 'center',
        transition: '200ms',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: theme.global.radius,
        background: enable
          ? theme.inputs.backgroundEnabled
          : theme.inputs.background,
        fontSize: theme.global.fonts,
        border: theme.inputs.border,
        color: theme.inputs.color,
        '&:hover, &:focus-within': {
          background: enable
            ? theme.inputs.backgroundEnabled
            : theme.inputs.backgroundHover,
          boxShadow: '0 1px 7.5px rgba(0, 0, 0, 0.15)',
        },
      }),
    })
  },
  Icon: ({ name = 'save' }) => {
    const theme = useContext(Theme)
    return create('div', {
      className: `far fa-${name} ${css({
        textAlign: 'center',
        lineHeight: '1.5em',
        padding: '15px',
        color: theme.inputs.error,
      })}`,
    })
  },
  Control: ({ label, description, change, input }) => {
    const theme = useContext(Theme)
    const [enable, changeEnable] = useState<boolean>(false)
    const [error, changeError] = useState<Error | undefined>()
    const mounted = useRef(false)
    const createdElement = useMemo(() => {
      return input({
        key: 'input',
        change: data => {
          if (change)
            change(data)
              .then(() => mounted.current && changeError(undefined))
              .catch(e => mounted.current && changeError(e))
        },
        enable: value => changeEnable(value),
      })
    }, [change])
    useEffect(() => {
      mounted.current = true
      return () => {
        mounted.current = false
      }
    }, [])
    return create('div', {
      children: [
        label &&
          create('div', {
            key: 'name',
            children: label,
            className: css({
              color: theme.inputs.colorPrimary,
            }),
          }),
        description &&
          create('div', {
            key: 'description',
            children: description,
            className: css({
              color: theme.inputs.colorSecondary,
            }),
          }),
        (label || description) &&
          create('div', {
            key: 'spacer',
            className: css({
              height: '7.5px',
            }),
          }),
        create(Inputs.Container, {
          key: 'container',
          enable,
          children: [
            createdElement,
            error &&
              create(Inputs.Pointer, {
                key: 'icon',
                label: error.message,
                children: create(Inputs.Icon, {
                  name: 'bell',
                }),
              }),
          ],
        }),
      ],
      className: css({
        all: 'unset',
        display: 'flex',
        flexDirection: 'column',
      }),
    })
  },
  Pointer: ({ children, label }) => {
    const theme = useContext(Theme)
    return create('div', {
      children: [
        create((() => children) as FC, {
          key: 'children',
        }),
        create('div', {
          key: 'pointer',
          children: create('div', {
            children: label,
            className: css({
              all: 'unset',
              display: 'flex',
              padding: '15px',
              fontSize: theme.global.fonts,
              borderRadius: theme.global.radius,
              background: theme.pointers.background,
              border: theme.pointers.border,
              color: theme.pointers.color,
              boxShadow: '0 1px 5px rgba(0, 0, 0, 0.15)',
            }),
          }),
          className: `toggle-pointer ${css({
            all: 'unset',
            width: '300px',
            position: 'absolute',
            right: '10px',
            bottom: '100%',
            marginBottom: '-10px',
            display: 'none',
            justifyContent: 'flex-end',
            '&:hover': {
              display: 'flex',
            },
          })}`,
        }),
      ],
      className: css({
        all: 'unset',
        display: 'flex',
        position: 'relative',
        '&:hover .toggle-pointer': {
          display: 'flex',
        },
      }),
    })
  },
  Number: ({
    value = '',
    change = () => {},
    placeholder,
    decimals = false,
  }) => {
    const [state, changeState] = useState<string>(String(value))
    useEffect(() => changeState(String(value || '')), [value])
    useEffect(
      () => change(decimals ? parseFloat(state) : parseInt(state, 10)),
      [state]
    )
    return create('input', {
      value: state,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length === 0) {
          changeState('')
        } else {
          const input = event.target.value
          const parsed = decimals ? parseFloat(input) : parseInt(input, 10)
          if (!isNaN(parsed) && input !== state) {
            const update = `${parsed}${
              decimals && input.endsWith('.') ? '.' : ''
            }`
            changeState(update || '')
          }
        }
      },
      placeholder,
      className: css({
        all: 'unset',
        padding: '15px',
        cursor: 'pointer',
        display: 'flex',
        flexGrow: 1,
      }),
    })
  },
  Boolean: ({
    value,
    change = () => {},
    enable = () => {},
    label,
    description,
  }) => {
    const theme = useContext(Theme)
    const [state, changeState] = useState<boolean>(value || false)
    useEffect(() => changeState(value || false), [value])
    useEffect(() => {
      change(state)
      enable(state)
    }, [state])
    return create('div', {
      onClick: () => changeState(!state),
      children: [
        create('div', {
          key: 'label',
          children: [
            create('div', {
              key: 'label',
              children: label,
              className: css({
                all: 'unset',
                flexGrow: 1,
              }),
            }),
            create('div', {
              key: 'icon',
              className: `far fas fa-${state ? 'check' : 'times'} ${css({
                textAlign: 'center',
                lineHeight: '1.5em',
                marginLeft: '7.5px',
              })}`,
            }),
          ],
          className: css({
            all: 'unset',
            display: 'flex',
            justifyContent: 'space-between',
            flexGrow: 1,
            color: theme.inputs.colorPrimary,
          }),
        }),
        create('div', {
          key: 'description',
          children: description,
          className: css({
            flexGrow: 1,
            color: theme.inputs.colorSecondary,
          }),
        }),
      ],
      className: css({
        all: 'unset',
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        cursor: 'pointer',
        flexGrow: 1,
      }),
    })
  },
  String: ({
    value,
    change = () => {},
    placeholder,
    large = false,
    password = false,
  }) => {
    const [state, changeState] = useState<string>(value || '')
    useEffect(() => changeState(value || ''), [value])
    useEffect(() => change(state), [state])
    return create(large ? 'textarea' : 'input', {
      value: state,
      onChange: (event: any) =>
        state !== event.target.value && changeState(event.target.value),
      placeholder,
      rows: large ? 6 : undefined,
      type: password ? 'password' : 'text',
      className: css({
        all: 'unset',
        padding: '15px',
        cursor: 'pointer',
        display: 'flex',
        flexGrow: 1,
      }),
    })
  },
  StringArray: ({ value, placeholder, change = () => {} }) => {
    const theme = useContext(Theme)
    const [open, changeOpen] = useState<boolean>(false)
    const [state, changeState] = useState<string[]>(value || [])
    const [current, changeCurrent] = useState<string>('')
    useEffect(() => {
      if (value && value.length !== state.length) changeState(value)
    }, [value])
    useEffect(() => change(state), [state])
    return create('div', {
      onClick: () => changeOpen(true),
      children: [
        create('div', {
          key: 'value',
          children: state.join(', ') || '...',
          className: css({
            flexGrow: 1,
          }),
        }),
        open &&
          create(OutsideClickHandler, {
            key: 'popup',
            onOutsideClick: () => changeOpen(false),
            children: create('div', {
              children: [
                create('input', {
                  key: 'input',
                  value: current,
                  autoFocus: true,
                  onKeyPress: event => {
                    if (
                      event.key === 'Enter' &&
                      current &&
                      state.indexOf(current) === -1
                    ) {
                      changeState([...state, current])
                      changeCurrent('')
                    }
                  },
                  onChange: event =>
                    current !== event.target.value &&
                    changeCurrent(event.target.value),
                  placeholder,
                  className: css({
                    all: 'unset',
                    display: 'flex',
                    padding: '15px',
                    cursor: 'pointer',
                  }),
                }),
                create('div', {
                  key: 'label',
                  onClick: () => {
                    if (current && state.indexOf(current) === -1) {
                      changeState([...state, current])
                      changeCurrent('')
                    }
                  },
                  children: [
                    create('div', {
                      key: 'label',
                      children: 'Press Enter to Add',
                      className: css({
                        all: 'unset',
                        flexGrow: 1,
                      }),
                    }),
                    create('div', {
                      key: 'icon',
                      className: `far fas fa-plus ${css({
                        textAlign: 'center',
                        lineHeight: '1.5em',
                        marginLeft: '7.5px',
                      })}`,
                    }),
                  ],
                  className: css({
                    all: 'unset',
                    display: 'flex',
                    padding: '15px',
                    background: theme.inputs.background,
                    flexGrow: 1,
                  }),
                }),
                state.map((item, index) =>
                  create('div', {
                    key: `${item}${index}`,
                    children: [
                      create('div', {
                        key: 'label',
                        children: item,
                        className: css({
                          all: 'unset',
                          flexGrow: 1,
                          padding: '15px',
                        }),
                      }),
                      create('div', {
                        key: 'icon',
                        onClick: () =>
                          changeState([...state.filter(i => i !== item)]),
                        className: `far fas fa-times ${css({
                          textAlign: 'center',
                          lineHeight: '1.5em',
                          padding: '15px 15px 15px 0',
                        })}`,
                      }),
                    ],
                    className: css({
                      all: 'unset',
                      display: 'flex',
                    }),
                  })
                ),
              ],
              className: css({
                all: 'unset',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                left: 0,
                right: 0,
                top: 0,
                zIndex: 100,
                overflow: 'hidden',
                borderRadius: theme.global.radius,
                background: theme.inputs.backgroundHover,
                boxShadow: '0 1px 7.5px rgba(0, 0, 0, 0.15)',
              }),
            }),
          }),
      ],
      className: css({
        all: 'unset',
        padding: '15px',
        cursor: 'pointer',
        display: 'flex',
        flexGrow: 1,
      }),
    })
  },
  StringMulti: ({ value, change = () => {}, options }) => {
    const theme = useContext(Theme)
    const [state, changeState] = useState<string[]>(value || [])
    useEffect(() => {
      if (value && value.length !== state.length) changeState(value)
    }, [value])
    useEffect(() => change(state), [state])
    const toggle = (i: string) =>
      state.includes(i) ? state.filter(a => i !== a) : [...state, i]
    return create('div', {
      children: options.map(option => {
        return create('div', {
          key: option.value,
          onClick: () => changeState(toggle(option.value)),
          children: [
            create('div', {
              key: 'label',
              children: [
                create('div', {
                  key: 'label',
                  children: option.label,
                  className: css({
                    all: 'unset',
                    flexGrow: 1,
                  }),
                }),
                create('div', {
                  key: 'icon',
                  className: `far fas fa-${
                    state.includes(option.value) ? 'check' : 'times'
                  } ${css({
                    textAlign: 'center',
                    lineHeight: '1.5em',
                    marginLeft: '7.5px',
                  })}`,
                }),
              ],
              className: css({
                all: 'unset',
                display: 'flex',
                justifyContent: 'space-between',
                flexGrow: 1,
                color: theme.inputs.colorPrimary,
              }),
            }),
            create('div', {
              key: 'description',
              children: option.description,
              className: css({
                flexGrow: 1,
                color: theme.inputs.colorSecondary,
              }),
            }),
          ],
          className: css({
            all: 'unset',
            display: 'flex',
            flexDirection: 'column',
            padding: '15px',
            cursor: 'pointer',
            flexGrow: 1,
            background: state.includes(option.value)
              ? theme.inputs.backgroundEnabled
              : undefined,
            '&:hover': {
              background: !state.includes(option.value)
                ? theme.inputs.background
                : undefined,
            },
          }),
        })
      }),
      className: css({
        all: 'unset',
        flexGrow: 1,
        borderRadius: theme.global.radius,
        overflow: 'hidden',
      }),
    })
  },
  Select: ({ value, change, search, options = [] }) => {
    const theme = useContext(Theme)
    const [open, changeOpen] = useState<boolean>(false)
    const [state, changeState] = useState<string | undefined>(value)
    const [current, changeCurrent] = useState<string>('')
    const show = options.find(i => i.value === state)
    useEffect(() => changeState(value), [value])
    useEffect(() => change && change(state), [state])
    useEffect(() => {
      if (search) search(current)
    }, [current])
    return create('div', {
      onClick: () => changeOpen(true),
      children: [
        create('div', {
          key: 'value',
          children: (show && show.label) || 'Select...',
          className: css({
            flexGrow: 1,
          }),
        }),
        open &&
          create(OutsideClickHandler, {
            key: 'popup',
            onOutsideClick: () => changeOpen(false),
            children: create('div', {
              children: [
                search &&
                  create('input', {
                    key: 'input',
                    value: current,
                    autoFocus: true,
                    onChange: (event: any) =>
                      current !== event.target.value &&
                      changeCurrent(event.target.value),
                    placeholder: 'Search...',
                    className: css({
                      all: 'unset',
                      display: 'flex',
                      padding: '15px',
                      cursor: 'pointer',
                    }),
                  }),
                create('div', {
                  key: 'label',
                  onClick: () => state && changeState(undefined),
                  children: [
                    create('div', {
                      key: 'label',
                      children: state ? 'Clear' : 'Choose...',
                      className: css({
                        all: 'unset',
                        flexGrow: 1,
                      }),
                    }),
                    state &&
                      create('div', {
                        key: 'icon',
                        className: `far fas fa-times ${css({
                          textAlign: 'center',
                          lineHeight: '1.5em',
                          marginLeft: '7.5px',
                        })}`,
                      }),
                  ],
                  className: css({
                    all: 'unset',
                    display: 'flex',
                    padding: '15px',
                    background: theme.inputs.background,
                    flexGrow: 1,
                  }),
                }),
                options.map(option => {
                  return create('div', {
                    key: option.value,
                    onClick: () => {
                      setTimeout(() => changeOpen(false))
                      setTimeout(() => changeState(option.value))
                    },
                    children: [
                      create('div', {
                        key: 'label',
                        children: [
                          create('div', {
                            key: 'label',
                            children: option.label,
                            className: css({
                              all: 'unset',
                              flexGrow: 1,
                            }),
                          }),
                          create('div', {
                            key: 'icon',
                            className: `far fas fa-${
                              option.value === state ? 'check' : 'plus'
                            } ${css({
                              textAlign: 'center',
                              lineHeight: '1.5em',
                              marginLeft: '7.5px',
                            })}`,
                          }),
                        ],
                        className: css({
                          all: 'unset',
                          display: 'flex',
                          flexGrow: 1,
                        }),
                      }),
                      create('div', {
                        key: 'value',
                        children: option.description,
                        className: css({
                          marginTop: '3.725px',
                          color: theme.inputs.colorSecondary,
                        }),
                      }),
                    ],
                    className: css({
                      all: 'unset',
                      display: 'flex',
                      padding: '15px',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      flexGrow: 1,
                      '&:hover': {
                        background: theme.inputs.background,
                      },
                    }),
                  })
                }),
              ],
              className: css({
                all: 'unset',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                left: 0,
                right: 0,
                top: 0,
                zIndex: 100,
                overflow: 'hidden',
                borderRadius: theme.global.radius,
                background: theme.inputs.backgroundHover,
                boxShadow: '0 1px 7.5px rgba(0, 0, 0, 0.15)',
              }),
            }),
          }),
      ],
      className: css({
        all: 'unset',
        padding: '15px',
        cursor: 'pointer',
        display: 'flex',
        flexGrow: 1,
      }),
    })
  },
  StripeCard: ({ stripe, change, issue }) => {
    const inputReference = useRef()
    const elementsCard = useRef<any>()
    useEffect(() => {
      elementsCard.current = stripe
        .elements({
          fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Rubik' }],
        })
        .create('card', {
          hidePostalCode: true,
          style: {
            base: {
              fontFamily: 'Rubik',
              fontWeight: 900,
              color: '#ffffff',
            },
          },
        })
    }, [])
    useEffect(() => {
      if (elementsCard.current && change) change(elementsCard.current)
      if (inputReference.current && elementsCard.current) {
        const updateErrors = (event: any) =>
          event.error && issue && issue(event.error)
        if (elementsCard.current) {
          elementsCard.current.mount(inputReference.current)
          elementsCard.current.addEventListener('change', updateErrors)
        }
        return () =>
          elementsCard.current &&
          elementsCard.current.removeEventListener('change', updateErrors)
      }
    }, [inputReference.current, elementsCard.current])
    return create('div', {
      ref: inputReference,
      className: css({
        all: 'unset',
        padding: '15px',
        cursor: 'pointer',
        display: 'flex',
        flexGrow: 1,
        '& > *': {
          flexGrow: 1,
        },
      }),
    })
  },
  Files: ({ change = () => {}, multiple = false }) => {
    const [state, changeState] = useState<FileList | undefined>()
    const refInput = useRef()
    useEffect(() => change(state), [state])
    return create('div', {
      children: create('input', {
        ref: refInput,
        value: state,
        multiple,
        type: 'file',
        onChange: () =>
          refInput && changeState((refInput.current || ({} as any)).files),
        className: css({
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          height: '100%',
          width: '100%',
          opacity: 0,
        }),
      }),
      className: css({
        all: 'unset',
        padding: '15px',
        display: 'flex',
        flexGrow: 1,
        position: 'relative',
      }),
    })
  },
}
