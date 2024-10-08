import { Navbar, Group, Code, ScrollArea, createStyles, rem } from '@mantine/core'
import { LinksGroup } from './NavbarLinksGroup'
import NavMenu from './NavMenu'

const useStyles = createStyles((theme) => ({
  navbar: {
//    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    backgroundColor: 'rgb(19 39 85)',
    paddingBottom: 0,
  },

  header: {
//    padding: theme.spacing.md,
	padding: rem(47),
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function NavbarNested() {
  const { classes } = useStyles();
  const links = NavMenu.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Navbar width={{ sm: rem(240) }} p="md" className={`${classes.navbar} h-auto`}>
      <Navbar.Section className={classes.header}>
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
      </Navbar.Section>
    </Navbar>
  );
}
