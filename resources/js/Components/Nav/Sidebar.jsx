import { Navbar, Group, Code, ScrollArea, createStyles } from '@mantine/core'
import { LinksGroup } from './NavbarLinksGroup'
import NavMenu from './NavMenu'

const useStyles = createStyles((theme) => ({
  navbar: {
//    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    backgroundColor: 'rgb(17 24 39)',
    paddingBottom: 0,
  },

  header: {
//    padding: theme.spacing.md,
	padding: '25px',
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${
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
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function NavbarNested() {
  const { classes } = useStyles();
  const links = NavMenu.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Navbar width={{ sm: 300 }} p="md" className={`${classes.navbar} h-auto`}>
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
      </Navbar.Section>
    </Navbar>
  );
}
