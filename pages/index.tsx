import Head from "next/head.js";
import styles from "../styles/Home.module.css";
import { Container, Table, Button, Header, Image } from "semantic-ui-react";

interface Activity {
  id: number;
  functionName: string;
  functionUrl: string | null;
  lastModifiedTime: string | null;
}

export const getServerSideProps = async () => {
  const host =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://nonomi.vercel.app";
  const resp = await fetch(`${host}/api/activity`);
  const json = await resp.json();
  const data = json as Activity[];
  return {
    props: { data },
  };
};

export default function Home(props: any) {
  // TODO: next.js에서 props 정의하는 방법?
  const activities: Activity[] = props.data;

  // TODO: 간단한 인증?

  return (
    <>
      <Head>
        <title>Nonomi</title>
        <meta name="description" content="Nonomi - Personal FaaS Router" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <main className={styles.main}>
        <Container>
          <Header as="h1">Nonomi</Header>
          <p>Personal FaaS Router</p>
          <Image src="/nonomi-memorial.jpg" size="large" alt="nonomi" />

          <Table compact selectable unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>activity</Table.HeaderCell>
                <Table.HeaderCell>last modified time</Table.HeaderCell>
                <Table.HeaderCell>actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {activities.map((activity, idx) => {
                const { functionName: name, functionUrl: url } = activity;
                const date = activity.lastModifiedTime
                  ? new Date(activity.lastModifiedTime)
                  : null;

                return (
                  <Table.Row key={idx} warning={!url}>
                    <Table.Cell>
                      {url ? <a href={url}> {name} </a> : name}
                    </Table.Cell>
                    <Table.Cell>{date?.toLocaleString() ?? "NULL"}</Table.Cell>
                    <Table.Cell>
                      <Button size="mini">synchronize</Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Container>
      </main>
    </>
  );
}
