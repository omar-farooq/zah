import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, UnstyledButton, createStyles, rem } from '@mantine/core';
import { ChevronRightIcon, ChevronLeftIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import NavLink from '@/Components/Nav/NavLink' 
import { Link } from '@inertiajs/react'

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
//    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
//    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
}));

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }) {
  const { classes, theme } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === 'ltr' ? ChevronRightIcon : ChevronLeftIcon;
  const items = (hasLinks ? links : []).map((link) => (

      //Joining a meeting isn't an inertia link as we're joining a channel, otherwise the broadcasting events bubble
      link.label == 'Join' ?
        <a
            className={`${classes.link} text-slate-300`}
            href={link.link}
            key={link.label}
        >
          {link.label}
        </a>
      :
        <NavLink
          className={`${classes.link} text-slate-300`}
          href={link.link}
          key={link.label}
        >
          {link.label}
        </NavLink>
  ));

  return (
      hasLinks ?
        <>
          <UnstyledButton onClick={() => setOpened((o) => !o)} className={`${classes.control} text-slate-300`}>
            <Group position="apart" spacing={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThemeIcon variant="dark" size={30}>
                    <Icon />
                </ThemeIcon>
                <Box ml="md">{label}</Box>
              </Box>
              {hasLinks && (
                <ChevronIcon
                  className="h-5, w-5"
                  style={{
                    transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                  }}
                />
              )}
            </Group>
          </UnstyledButton>
        <Collapse in={opened}>{items}</Collapse> 
        </>
        :
        <>
            <Link href="/">
                <UnstyledButton onClick={() => setOpened((o) => !o)} className={`${classes.control} text-slate-300`}>
                    <Group position="apart" spacing={0}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ThemeIcon variant="dark" size={30}>
                                <Icon />
                            </ThemeIcon>
                            <Box ml="md">{label}</Box>
                        </Box>
                        {hasLinks && (
                            <ChevronIcon
                                className="h-5, w-5"
                                style={{
                                    transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
                                }}
                            />
                        )}
                    </Group>
                </UnstyledButton>
            </Link>
        </>
      
  );
}
