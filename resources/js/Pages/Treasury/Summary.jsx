import { createStyles, Group, Paper, SimpleGrid, Text } from '@mantine/core';

export default function TreasurySummary() {

    const useStyles = createStyles((theme) => ({
          root: {
                  padding: `calc(${theme.spacing.xl} * 1.5)`,
                },

          value: {
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: 1,
                },

          diff: {
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                },

          icon: {
                  color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
                },

          title: {
                  fontWeight: 700,
                  textTransform: 'uppercase',
                },
    }));

    const data = [
        {title: 'test', value: '12', diff: 13}
    ]
      const { classes } = useStyles();
      const stats = data.map((stat) => {

              return (
                        <Paper withBorder p="md" radius="md" key={stat.title}>
                          <Group position="apart">
                            <Text size="xs" color="dimmed" className={classes.title}>
                              {stat.title}
                            </Text>
                          </Group>

                          <Group align="flex-end" spacing="xs" mt={25}>
                            <Text className={classes.value}>{stat.value}</Text>
                            <Text color={stat.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
                              <span>{stat.diff}%</span>
                            </Text>
                          </Group>

                          <Text fz="xs" c="dimmed" mt={7}>
                            Compared to previous month
                          </Text>
                        </Paper>
                      );
            });
      return (
              <div className={classes.root}>
                <SimpleGrid
                  cols={4}
                  breakpoints={[
                                { maxWidth: 'md', cols: 2 },
                                { maxWidth: 'xs', cols: 1 },
                              ]}
                >
                  {stats}
                </SimpleGrid>
              </div>
      )
}
