import React, {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import { IonItem, IonLabel, IonNote, IonSearchbar } from "@ionic/react";
import { Job } from "../../interfaces/Job/Job";
import "../../assets/styles/job/job-lists.css";
import CardList from "../Custom/Card/CardList";
import CategoryTitle from "../Custom/Headers/CategoryTitle";
import LoadingSpinner from "../../pages/Other/LoadingSpinner";
import useFetchJobs from "../../hooks/job/use-job";

type JobListsProps = {
  jobsByCategory: Record<string, Job[]>;
};

const JobLists: React.FC<JobListsProps> = ({ jobsByCategory }) => {
  const [search, setSearch] = useState("");
  const [searchbarHeight, setSearchbarHeight] = useState(0);
  const searchbarRef = useRef<HTMLDivElement>(null);
  const { loading } = useFetchJobs();

  useLayoutEffect(() => {
    if (searchbarRef.current) {
      setSearchbarHeight(searchbarRef.current.offsetHeight);
    }
  }, [search]);

  const filteredJobsByCategory = Object.entries(jobsByCategory).reduce(
    (acc, [categoryTitle, jobs]) => {
      const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredJobs.length > 0) {
        acc[categoryTitle] = filteredJobs;
      }
      return acc;
    },
    {} as Record<string, Job[]>
  );

  const handleSearchbarTouch = () => {
    const ionContent = document.querySelector("ion-content");
    const scrollEl = ionContent?.shadowRoot?.querySelector(".inner-scroll");
    const cardListElement = document.querySelector(".card-list-wrapper");

    if (
      scrollEl instanceof HTMLElement &&
      cardListElement instanceof HTMLElement &&
      searchbarRef.current
    ) {
      const cardListRect = cardListElement.getBoundingClientRect();
      const ionContentRect = scrollEl.getBoundingClientRect();
      const offsetTop = cardListRect.top - ionContentRect.top;
      const scrollToPos =
        scrollEl.scrollTop + offsetTop - searchbarRef.current.offsetHeight;

      scrollEl.scrollTo({ top: scrollToPos, behavior: "smooth" });
    }
  };

  const isDisabled = (job: Job): boolean => {
    if (!job.disabledUntil) return false;
    const now = new Date();
    const disableUntil = new Date(job.disabledUntil);
    return disableUntil > now;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="searchbar-wrapper" ref={searchbarRef}>
        <IonSearchbar
          debounce={1000}
          onClick={handleSearchbarTouch}
          mode="md"
          style={{ width: "95%", borderRadius: "3rem" }}
          value={search}
          inputMode="text"
          onIonInput={(e) => setSearch(e.detail.value!)}
          placeholder="Search jobs..."
        />
      </div>

      <div className="card-list-wrapper">
        <CardList
          style={{
            paddingInline: "1rem",
            paddingTop: "2rem",
            height: search ? `calc(100vh - ${searchbarHeight}px)` : "100%",
          }}>
          {Object.entries(filteredJobsByCategory).map(
            ([categoryTitle, jobs]) => (
              <Fragment key={categoryTitle}>
                <CategoryTitle categoryTitle={categoryTitle} />
                {jobs.map((job) => {
                  const disabled = isDisabled(job);
                  return (
                    <IonItem
                      button
                      detail={!disabled}
                      routerLink={`/tabs/job/${job._id}`}
                      disabled={disabled}
                      className="ion-align-items-center"
                      key={job._id}>
                      <IonLabel style={{ textTransform: "capitalize" }}>
                        {job.title}
                      </IonLabel>

                      {disabled && (
                        <IonNote color={"medium"} slot="end">
                          Disabled until{" "}
                          {new Date(job.disabledUntil!).toLocaleDateString()}
                        </IonNote>
                      )}
                    </IonItem>
                  );
                })}
              </Fragment>
            )
          )}
        </CardList>
      </div>
    </div>
  );
};

export default JobLists;
