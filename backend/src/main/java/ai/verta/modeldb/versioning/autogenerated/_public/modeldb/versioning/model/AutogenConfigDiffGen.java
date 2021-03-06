// THIS FILE IS AUTO-GENERATED. DO NOT EDIT
package ai.verta.modeldb.versioning.autogenerated._public.modeldb.versioning.model;

import ai.verta.modeldb.versioning.*;
import ai.verta.modeldb.versioning.blob.diff.*;
import com.pholser.junit.quickcheck.generator.*;
import com.pholser.junit.quickcheck.generator.java.util.*;
import com.pholser.junit.quickcheck.random.*;
import java.util.*;

public class AutogenConfigDiffGen extends Generator<AutogenConfigDiff> {
  public AutogenConfigDiffGen() {
    super(AutogenConfigDiff.class);
  }

  @Override
  public AutogenConfigDiff generate(SourceOfRandomness r, GenerationStatus status) {
    // if (r.nextBoolean())
    //     return null;

    AutogenConfigDiff obj = new AutogenConfigDiff();
    if (r.nextBoolean()) {
      int size = r.nextInt(0, 10);
      List<AutogenHyperparameterSetConfigDiff> ret = new ArrayList(size);
      for (int i = 0; i < size; i++) {
        ret.add(gen().type(AutogenHyperparameterSetConfigDiff.class).generate(r, status));
      }
      obj.setHyperparameterSet(Utils.removeEmpty(ret));
    }
    if (r.nextBoolean()) {
      int size = r.nextInt(0, 10);
      List<AutogenHyperparameterConfigDiff> ret = new ArrayList(size);
      for (int i = 0; i < size; i++) {
        ret.add(gen().type(AutogenHyperparameterConfigDiff.class).generate(r, status));
      }
      obj.setHyperparameters(Utils.removeEmpty(ret));
    }
    return obj;
  }
}
