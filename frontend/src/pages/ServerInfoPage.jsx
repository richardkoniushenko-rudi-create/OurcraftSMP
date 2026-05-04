import ServerInfo from "@/components/ServerInfo";

export default function ServerInfoPage({ info, status }) {
  return (
    <div data-testid="server-info-page" className="pt-20">
      <ServerInfo info={info} status={status} />
    </div>
  );
}
