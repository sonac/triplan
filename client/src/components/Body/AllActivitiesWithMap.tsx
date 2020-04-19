import * as React from "react";
import { useState, useEffect } from "react";
import ActivityWithMap from "./ActivityWithMap";

export default props => {
  const constActivities = [
    {
      id: 3201623104,
      distance: 5007.2,
      movingTime: 1635.0,
      elapsedTime: 1645.0,
      activityType: "Run",
      startDate: "2020-03-20T22:16:15",
      averageSpeed: 3.063,
      averageWatts: 0.0,
      mapPolyline:
        "awj_IcbkpAAC?Bc@Bk@Gc@CyAF[Cs@J[JoBKw@Qg@@g@HyC?g@GGKAQMq@eAs@g@{@i@kAa@uBi@eCO}@Eu@DiDc@k@GaAEqBHwAGaCKs@C}@DsBIeED}@CcCI{@A{@@uJGaA@e@NcCF{BEy@M}@EaEG_AYw@_@u@Qw@G_AHgDG}B@_AC}@@aCAaA[_EA}BCcAByAbAuBRw@J{@NyBAaAG}@A_AD_A^a@EaAG{@?aALy@AaAYw@M_A?{@~@I|B]x@Ed@EnA?h@BjAVhALnAFf@Af@Ff@EZDVr@BdAA~@JzBd@rD?`CJxDF~@Nx@RnB?jBAd@HzB?pBD~@XrARr@Fh@@t@ETAl@DxCLzB?`APzBB`AZxBVzFl@pHAr@Kh@SVT`FJ|@ZrBRtBDx@D~@BvBXhMPv@PnAF`Ar@fFTv@D|BH~@C|@D~@ZxDJv@L|BEh@e@FmAHe@?g@Be@AoBBmAC"
    },
    {
      id: 3201623104,
      distance: 5007.2,
      movingTime: 1635.0,
      elapsedTime: 1645.0,
      activityType: "Run",
      startDate: "2020-03-20T22:16:15",
      averageSpeed: 3.063,
      averageWatts: 0.0,
      mapPolyline:
        "awj_IcbkpAAC?Bc@Bk@Gc@CyAF[Cs@J[JoBKw@Qg@@g@HyC?g@GGKAQMq@eAs@g@{@i@kAa@uBi@eCO}@Eu@DiDc@k@GaAEqBHwAGaCKs@C}@DsBIeED}@CcCI{@A{@@uJGaA@e@NcCF{BEy@M}@EaEG_AYw@_@u@Qw@G_AHgDG}B@_AC}@@aCAaA[_EA}BCcAByAbAuBRw@J{@NyBAaAG}@A_AD_A^a@EaAG{@?aALy@AaAYw@M_A?{@~@I|B]x@Ed@EnA?h@BjAVhALnAFf@Af@Ff@EZDVr@BdAA~@JzBd@rD?`CJxDF~@Nx@RnB?jBAd@HzB?pBD~@XrARr@Fh@@t@ETAl@DxCLzB?`APzBB`AZxBVzFl@pHAr@Kh@SVT`FJ|@ZrBRtBDx@D~@BvBXhMPv@PnAF`Ar@fFTv@D|BH~@C|@D~@ZxDJv@L|BEh@e@FmAHe@?g@Be@AoBBmAC"
    },
    {
      id: 3201623104,
      distance: 5007.2,
      movingTime: 1635.0,
      elapsedTime: 1645.0,
      activityType: "Run",
      startDate: "2020-03-20T22:16:15",
      averageSpeed: 3.063,
      averageWatts: 0.0,
      mapPolyline:
        "awj_IcbkpAAC?Bc@Bk@Gc@CyAF[Cs@J[JoBKw@Qg@@g@HyC?g@GGKAQMq@eAs@g@{@i@kAa@uBi@eCO}@Eu@DiDc@k@GaAEqBHwAGaCKs@C}@DsBIeED}@CcCI{@A{@@uJGaA@e@NcCF{BEy@M}@EaEG_AYw@_@u@Qw@G_AHgDG}B@_AC}@@aCAaA[_EA}BCcAByAbAuBRw@J{@NyBAaAG}@A_AD_A^a@EaAG{@?aALy@AaAYw@M_A?{@~@I|B]x@Ed@EnA?h@BjAVhALnAFf@Af@Ff@EZDVr@BdAA~@JzBd@rD?`CJxDF~@Nx@RnB?jBAd@HzB?pBD~@XrARr@Fh@@t@ETAl@DxCLzB?`APzBB`AZxBVzFl@pHAr@Kh@SVT`FJ|@ZrBRtBDx@D~@BvBXhMPv@PnAF`Ar@fFTv@D|BH~@C|@D~@ZxDJv@L|BEh@e@FmAHe@?g@Be@AoBBmAC"
    },
    {
      id: 3201623104,
      distance: 5007.2,
      movingTime: 1635.0,
      elapsedTime: 1645.0,
      activityType: "Run",
      startDate: "2020-03-20T22:16:15",
      averageSpeed: 3.063,
      averageWatts: 0.0,
      mapPolyline:
        "awj_IcbkpAAC?Bc@Bk@Gc@CyAF[Cs@J[JoBKw@Qg@@g@HyC?g@GGKAQMq@eAs@g@{@i@kAa@uBi@eCO}@Eu@DiDc@k@GaAEqBHwAGaCKs@C}@DsBIeED}@CcCI{@A{@@uJGaA@e@NcCF{BEy@M}@EaEG_AYw@_@u@Qw@G_AHgDG}B@_AC}@@aCAaA[_EA}BCcAByAbAuBRw@J{@NyBAaAG}@A_AD_A^a@EaAG{@?aALy@AaAYw@M_A?{@~@I|B]x@Ed@EnA?h@BjAVhALnAFf@Af@Ff@EZDVr@BdAA~@JzBd@rD?`CJxDF~@Nx@RnB?jBAd@HzB?pBD~@XrARr@Fh@@t@ETAl@DxCLzB?`APzBB`AZxBVzFl@pHAr@Kh@SVT`FJ|@ZrBRtBDx@D~@BvBXhMPv@PnAF`Ar@fFTv@D|BH~@C|@D~@ZxDJv@L|BEh@e@FmAHe@?g@Be@AoBBmAC"
    }
  ];

  const [activities, setActivities] = useState(null);

  useEffect(() => {
    fetch("/api/user/asumko")
      .then(resp => resp.json())
      .then(data => setActivities(data.activities))
      .catch(err => console.error(err));
  }, []);

  if (activities === null) {
    return <div>Activities are loading</div>;
  }
  console.log(activities[0][0]);
  return (
    <div className="allActivitiesWithMap">
      {activities[0]
        .filter(a => a.mapPolyline.length > 0)
        .slice(0, 5)
        .map(activity => (
          <ActivityWithMap key={activity.id} activity={activity} />
        ))}
    </div>
  );
};
